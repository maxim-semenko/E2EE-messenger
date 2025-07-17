export enum MessageType {
    CHAT = 'CHAT',
    HELLO = 'HELLO',
    IAM = 'IAM',
    CONTENT = 'CONTENT',
    WHO = 'WHO',
    SERVER = 'SERVER',
}

export interface Message {
    id?: string;
    sender: string;
    receiver: string;
    chat: string | null;
    type: MessageType;
    content?: string;
    iv: string,
    created?: Date;
    decrypted?: boolean
}