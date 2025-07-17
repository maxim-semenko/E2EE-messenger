import {AnimatePresence} from "framer-motion";
import {Animate} from "@/components/Animate.tsx";
import {Box, Heading, Text} from "@chakra-ui/react";
import {useChatStore} from "@/store/chatStore.ts";

export const SelectedChat = () => {

    const chats = useChatStore((state) => state.chats);
    const selectedChat = useChatStore((state) => state.selectedChat);

    return (
        <Box flex="1" p={6} overflowY="auto">
            <AnimatePresence mode="wait">
                {selectedChat ? (
                    <Animate key={selectedChat.id}>
                        <Box>
                            <Heading size="md">Chat
                                with {chats.find(c => c.id === selectedChat.id)?.title}</Heading>
                        </Box>
                    </Animate>
                ) : (
                    <Animate key="empty">
                        <Text fontSize="xl" color="gray.500">Select chat</Text>
                    </Animate>
                )}
            </AnimatePresence>
        </Box>
    )
}