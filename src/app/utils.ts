export function base64ToXml(base64: string): string {
    // Decode Base64 to binary string
    const binaryString = atob(base64);

    // Convert binary string to bytes
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    // Decode bytes into UTF-8 text
    return new TextDecoder('utf-8').decode(bytes);
}
