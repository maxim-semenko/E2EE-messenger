export async function generateRSAKeyPair(): Promise<CryptoKeyPair> {
    return await window.crypto.subtle.generateKey(
        {
            name: "RSA-PSS",
            modulusLength: 3072,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-512",
        },
        true,
        ["sign", "verify"]
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