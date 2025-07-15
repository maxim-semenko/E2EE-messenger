import axios from "axios";
import {base64ToPem, generateRSAKeyPair, getBase64FromCryptoKey, pemToBase64} from "../lib/keys.ts";


export type KeySource =
    | { type: 'generate' }
    | { type: 'import' };

export async function initKeys(source: KeySource) {
    let publicKey, privateKey;
    if (source.type === 'generate') {
        await generateRSAKeyPair()
        const keys = await generateRsaKeys();
        publicKey = keys.publicKey;
        privateKey = keys.privateKey;
    } else if (source.type === 'import') {
        const keys = await importRsaKeys();
        publicKey = keys.publicKey;
        privateKey = keys.privateKey;
    }

    if (publicKey && privateKey) {
        const userId = await authViaKeys(publicKey, privateKey);

        return {
            userId: userId,
            publicKey: publicKey,
            privateKey: privateKey
        }
    }

    return null;

}

async function generateRsaKeys() {
    const keys = await generateRSAKeyPair();
    const [publicPem, privatePem] = await Promise.all([
        base64ToPem(await getBase64FromCryptoKey(keys.publicKey), "PUBLIC KEY"),
        base64ToPem(await getBase64FromCryptoKey(keys.privateKey), "PRIVATE KEY"),
    ]);

    return {
        publicKey: publicPem,
        privateKey: privatePem
    };
}

export async function importRsaKeys() {
    const keys = await readKeysFromFile();
    const [publicPem, privatePem] = [
        extractPemBlock(keys, "PUBLIC KEY"),
        extractPemBlock(keys, "PRIVATE KEY")
    ];

    console.log(publicPem)
    console.log(privatePem)

    return {
        publicKey: publicPem,
        privateKey: privatePem
    };
}

async function authViaKeys(publicPem: string, privatePem: string) {
    const publicKeyBase64 = pemToBase64(publicPem);
    const resp = await axios.post<string>("/api/v1/users", {publicKey: publicKeyBase64});
    const userId = resp.data;

    localStorage.setItem("privateKey", privatePem);
    localStorage.setItem("publicKey", publicPem);
    localStorage.setItem("userId", userId);
    addPublicKeyToLocalStorage(userId, publicPem);

    return userId;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function addPublicKeyToLocalStorage(userId: string, publicKey: string) {
    const storedKeys = JSON.parse(localStorage.getItem("publicKeys") || "[]");
    storedKeys.push({userId: userId, publicKey: publicKey});
    localStorage.setItem("publicKeys", JSON.stringify(storedKeys));
}

export function downloadKeysFile(privatePem: string, publicPem: string, filename = "keys.pem") {
    const content = `${privatePem}\n\n${publicPem}`.trim();

    const blob = new Blob([content], {type: "text/plain"});
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function readKeysFromFile(): Promise<string> {
    return new Promise((resolve, reject) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".pem,.txt";

        input.onchange = () => {
            const file = input.files?.[0];
            if (!file) return reject("FIle is not selected");

            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject("Error to read file");

            reader.readAsText(file);
        };

        input.click();
    });
}

function extractPemBlock(pemText: string, label: string): string {
    const regex = new RegExp(`-----BEGIN ${label}-----[\\s\\S]+?-----END ${label}-----`, "g");
    const match = pemText.match(regex);
    return match ? match[0] : "";
}