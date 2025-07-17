import type {Chat} from "@/model/chat.ts";
import {create} from "zustand";
import axios from "axios";
import {type CurrentUser, useUserStore} from "@/store/userStore.ts";
import type {PaginatedResponse} from "@/model/types.ts";
import {type Message, MessageType} from "@/model/message.ts";
import {
    arrayBufferToBase64,
    base64ToArrayBuffer,
    decryptAES,
    decryptAESKey,
    encryptAES,
    encryptAESKey,
    generateAESKey,
    importRsaPrivateKeyFromPem,
    importRsaPublicKeyFromPem
} from "@/lib/keys.ts";
import useWebSocket from "@/hooks/useWebSocket.ts";


export interface ChatStore {
    // Data
    chats: Chat[];
    selectedChat: Chat | null;

    // Setters
    setChats: (chats: Chat[]) => void;
    setSelectedChat: (chat: Chat) => void;
    reset: () => void;
    // API
    loadChats: (user: CurrentUser) => void;
    createChat: (title: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
    chats: [],
    selectedChat: null,

    setChats: (chats) => set({chats}),
    setSelectedChat: (selectedChat) => set({selectedChat}),
    reset: () => set({chats: [], selectedChat: null}),

    loadChats: (user: CurrentUser) => {
        (async () => {
            if (!user) return;

            const userId = user.id;
            const privateKey = user.privateKey;

            try {
                const resp = await axios.get<PaginatedResponse<Message>>(`api/v1/messages/chats?from=${userId}`);
                const encryptedChats = resp.data.content;

                async function decryptChat(encryptedMessage: Message): Promise<Chat | null> {
                    if (!encryptedMessage.content) return null;

                    const [titleBase64, encryptedKeyBase64] = encryptedMessage.content.split("::");
                    const titleCipher = base64ToArrayBuffer(titleBase64);
                    const encryptedKey = base64ToArrayBuffer(encryptedKeyBase64);

                    const aesKey = await decryptAESKey(encryptedKey, await importRsaPrivateKeyFromPem(privateKey));
                    const title = await decryptAES(titleCipher, new Uint8Array(base64ToArrayBuffer(encryptedMessage.iv)), aesKey);

                    return {
                        id: encryptedMessage.id,
                        title,
                        aes: aesKey,
                    };
                }

                const decryptedChats = (await Promise.all(encryptedChats.map(decryptChat)))
                    .filter((chat): chat is Chat => chat !== null);

                set({chats: decryptedChats});
            } catch (error) {
                console.error("Failed to load or decrypt chats:", error);
            }
        })();
    },
    createChat: async (title: string) => {
        const user = useUserStore.getState().user;
        const {ws} = useWebSocket();

        if (!user || !ws) return;

        const generatedChatAESKey = await generateAESKey(128);
        const userPublicKey = await importRsaPublicKeyFromPem(user.publicKey);

        const {cipher, iv} = await encryptAES(title, generatedChatAESKey);
        const encryptedAESKey = await encryptAESKey(generatedChatAESKey, userPublicKey);

        const message: Message = {
            sender: user.id,
            receiver: user.id,
            type: MessageType.CHAT,
            iv: arrayBufferToBase64(iv),
            content: `${arrayBufferToBase64(cipher)}::${arrayBufferToBase64(encryptedAESKey)}`,
            chat: null,
        };

        ws.sendMessages([message]);
    }
}));
