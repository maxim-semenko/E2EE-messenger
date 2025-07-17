import {create} from "zustand";

interface ModalStore {
    isCreateChatOpen: boolean;

    setIsCreateChatOpen: (isOpen: boolean) => void;

    resetModals: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
    isCreateChatOpen: false,

    setIsCreateChatOpen: (isOpen) => set({isCreateChatOpen: isOpen}),

    resetModals: () =>
        set({
            isCreateChatOpen: false,
        }),
}));