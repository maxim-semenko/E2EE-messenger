import {Box, Button, VStack} from "@chakra-ui/react";
import {useChatStore} from "@/store/chatStore.ts";
import {useModalStore} from "@/store/modalStore.ts";

export const ChatList = () => {

    const chats = useChatStore((state) => state.chats);
    const selectedChat = useChatStore((state) => state.selectedChat);
    const setIsCreateChatOpen = useModalStore((state) => state.setIsCreateChatOpen);
    const setSelectedChat = useChatStore((state) => state.setSelectedChat);


    return (
        <Box w="250px" bg="gray.700" p={4} overflowY="auto" borderRight="1px solid #ccc">
            <Button
                colorScheme="teal"
                onClick={() => setIsCreateChatOpen(true)}
                justifyContent="start"
            >
                Create chat
            </Button>
            <VStack align="stretch" style={{marginTop: 20}}>
                {chats.map(chat => (
                    <Button
                        key={chat.id}
                        variant={selectedChat?.id === chat.id ? "solid" : "ghost"}
                        colorScheme="teal"
                        onClick={() => setSelectedChat(chat ?? null)}
                        justifyContent="start"
                    >
                        {chat.title}
                    </Button>
                ))}
            </VStack>
        </Box>
    )
}