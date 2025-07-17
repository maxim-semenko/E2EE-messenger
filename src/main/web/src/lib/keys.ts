export async function generateRSAKeyPair(length: number): Promise<CryptoKeyPair> {
    return await window.crypto.subtle.generateKey(
        {
            name: "RSA-PSS",
            modulusLength: length,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-512",
        },
        true,
        ["sign", "verify"]
    );
}


export async function generateAESKey(length: number): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: length,
        },
        true,
        ["encrypt", "decrypt"]
    );
}

export async function getBase64FromCryptoKey(key: CryptoKey) {
    const spkiOrPkcs8 = await window.crypto.subtle.exportKey(key.type === "public" ? "spki" : "pkcs8", key);

    const exportedAsString = String.fromCharCode(...new Uint8Array(spkiOrPkcs8));
    const exportedAsBase64 = btoa(exportedAsString);

    return exportedAsBase64.match(/.{1,64}/g)?.join("\n") ?? exportedAsBase64;

}

export function base64ToPem(base64: string, type: 'PUBLIC KEY' | 'PRIVATE KEY'): string {
    const formatted = base64.match(/.{1,64}/g)?.join('\n') ?? '';
    return `-----BEGIN ${type}-----\n${formatted}\n-----END ${type}-----`;
}

export function pemToBase64(pem: string): string {
    return pem
        .replace(/-----BEGIN [^-]+-----/, "")
        .replace(/-----END [^-]+-----/, "")
        .replace(/\s+/g, "");
}


export function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const len = binary.length;
    const buffer = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        buffer[i] = binary.charCodeAt(i);
    }
    return buffer.buffer;
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    return btoa(binary);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export async function importRsaPublicKeyFromPem(pem: string): Promise<CryptoKey> {
    const pemBody = pemToBase64(pem);
    const binaryDer = base64ToArrayBuffer(pemBody);

    return await window.crypto.subtle.importKey(
        "spki",
        binaryDer,
        {
            name: "RSA-OAEP",
            hash: "SHA-256",
        },
        true,
        ["encrypt"]
    );
}

export async function importRsaPrivateKeyFromPem(pem: string): Promise<CryptoKey> {
    const pemBody = pemToBase64(pem);
    const binaryDer = base64ToArrayBuffer(pemBody);

    return await window.crypto.subtle.importKey(
        "pkcs8",
        binaryDer,
        {
            name: "RSA-OAEP",
            hash: "SHA-256",
        },
        true,
        ["decrypt"]
    );
}

export async function encryptAES(plainText: string, key: CryptoKey): Promise<{ cipher: ArrayBuffer; iv: Uint8Array }> {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plainText);

    const cipher = await window.crypto.subtle.encrypt({
            name: "AES-GCM",
            iv,
        },
        key,
        encoded
    );

    return {cipher, iv};
}

export async function decryptAES(cipher: ArrayBuffer, iv: Uint8Array, key: CryptoKey): Promise<string> {
    const decrypted = await window.crypto.subtle.decrypt({
            name: "AES-GCM",
            iv,
        },
        key,
        cipher
    );

    return new TextDecoder().decode(decrypted);
}

export async function encryptAESKey(aesKey: CryptoKey, publicKey: CryptoKey): Promise<ArrayBuffer> {
    const raw = await window.crypto.subtle.exportKey("raw", aesKey);
    return await window.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP",
        },
        publicKey,
        raw
    );
}

export async function decryptAESKey(encryptedKey: ArrayBuffer, privateKey: CryptoKey): Promise<CryptoKey> {
    const raw = await window.crypto.subtle.decrypt({
            name: "RSA-OAEP",
        },
        privateKey,
        encryptedKey
    );

    return await window.crypto.subtle.importKey(
        "raw",
        raw,
        {name: "AES-GCM"},
        true,
        ["encrypt", "decrypt"]
    );
}