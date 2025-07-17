import type {Chat} from "@/model/chat.ts";
import {create} from "zustand";
import axios from "axios";
import type {CurrentUser} from "@/components/store/userStore.ts";
import type {PaginatedResponse} from "@/model/types.ts";
import type {Message} from "@/model/message.ts";
import {base64ToArrayBuffer, decryptAES, decryptAESKey, importRsaPrivateKeyFromPem} from "@/lib/keys.ts";


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
    }
}));
