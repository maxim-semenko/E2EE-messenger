import axios from "axios";
import {base64ToPem, generateRSAKeyPair, getBase64FromCryptoKey} from "../lib/keys.ts";


export async function initKeys(file?: string) {
    let publicKey, privateKey;
    if (file) {
        const keys = await importRsaKeys(file);
        publicKey = keys.publicKey;
        privateKey = keys.privateKey;
    } else {
        const keys = await generateRsaKeys();
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
    const keys = await generateRSAKeyPair(3072);
    const [publicPem, privatePem] = await Promise.all([
        base64ToPem(await getBase64FromCryptoKey(keys.publicKey), "PUBLIC KEY"),
        base64ToPem(await getBase64FromCryptoKey(keys.privateKey), "PRIVATE KEY"),
    ]);

    return {
        publicKey: publicPem,
        privateKey: privatePem
    };
}

export async function importRsaKeys(file: any) {
    const keys = await readKeysFromFile(file);
    const [publicPem, privatePem] = [
        extractPemBlock(keys, "PUBLIC KEY"),
        extractPemBlock(keys, "PRIVATE KEY")
    ];

    return {
        publicKey: publicPem,
        privateKey: privatePem
    };
}

async function authViaKeys(publicPem: string, privatePem: string) {
    const resp = await axios.post<string>("/api/v1/users", {publicKey: publicPem});
    const userId = resp.data;

    const currentUser = {
        privateKey: privatePem,
        publicKey: publicPem,
        userId: userId
    };

    localStorage.setItem("currentUser", JSON.stringify(currentUser));

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

function readKeysFromFile(filename: any): Promise<string> {
    return new Promise((resolve, reject) => {

        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject("Error to read file");

        reader.readAsText(filename);

    });
}

function extractPemBlock(pemText: string, label: string): string {
    const regex = new RegExp(`-----BEGIN ${label}-----[\\s\\S]+?-----END ${label}-----`, "g");
    const match = pemText.match(regex);
    return match ? match[0] : "";
}