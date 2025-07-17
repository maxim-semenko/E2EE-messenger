import {useModalStore} from "@/store/modalStore.ts";
import {Modal} from "@/components/Modal.tsx";
import {Field} from "@chakra-ui/react";
import {useChatStore} from "@/store/chatStore.ts";

export const CreateChatModal = () => {

    const isCreateChatOpen = useModalStore((state) => state.isCreateChatOpen);
    const setIsCreateChatOpen = useModalStore((state) => state.setIsCreateChatOpen);
    const createChat = useChatStore((state) => state.createChat);

    if (isCreateChatOpen) {
        return (
            <Modal
                title="Create chat"
                size="xl"
                isOpen={isCreateChatOpen}
                onClose={() => setIsCreateChatOpen(false)}
                onConfirm={() => createChat("")}
                showTrigger={false}
            >
                <Field.Root>
                    <Field.Label>
                        Chat title
                    </Field.Label>
                </Field.Root>
            </Modal>
        )
    }
}
