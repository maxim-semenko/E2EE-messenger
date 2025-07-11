export async function generateRSAKeyPair(): Promise<CryptoKeyPair> {
    return await window.crypto.subtle.generateKey(
        {
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true, // можно экспортировать ключи
        ["sign", "verify"]
    );
}

export async function exportCryptoKeyToPEM(key: CryptoKey): Promise<string> {
    const spkiOrPkcs8 = await window.crypto.subtle.exportKey(
        key.type === "public" ? "spki" : "pkcs8",
        key
    );

    const exportedAsString = String.fromCharCode(...new Uint8Array(spkiOrPkcs8));
    const exportedAsBase64 = btoa(exportedAsString);

    const pemHeader = key.type === "public"
        ? "-----BEGIN PUBLIC KEY-----"
        : "-----BEGIN PRIVATE KEY-----";

    const pemFooter = key.type === "public"
        ? "-----END PUBLIC KEY-----"
        : "-----END PRIVATE KEY-----";

    const pemBody = exportedAsBase64.match(/.{1,64}/g)?.join("\n") ?? exportedAsBase64;

    return `${pemHeader}\n${pemBody}\n${pemFooter}`;
}