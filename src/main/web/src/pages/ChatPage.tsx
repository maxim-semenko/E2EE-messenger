import {Box, Button, Flex, Heading, Spacer, Text, VStack} from "@chakra-ui/react";
import {useUser} from "@/context/UserContext.ts";
import {useNavigate} from "react-router-dom";
import {AnimatePresence} from "framer-motion";
import {Animate} from "@/components/Animate.tsx";
import {useState} from "react";

function ChatPage() {
    const {setUser} = useUser();
    const navigate = useNavigate();

    const [selectedChat, setSelectedChat] = useState<string | null>(null);

    const chatList = [
        {id: "1", name: "Alice"},
        {id: "2", name: "Bob"},
        {id: "3", name: "Charlie"},
    ];

    const Header = () => (
        <Box as="header" w="100%" bg="gray.800" color="white" px={6} py={4} boxShadow="md">
            <Flex align="center" w="100%">
                <Heading size="md">Veil</Heading>
                <Spacer/>
                <Button variant="ghost"
                        color="white"
                        _hover={{bg: "gray.700"}}
                        onClick={() => {
                            localStorage.removeItem("currentUser")
                            setUser(null)
                            navigate("/");
                        }}>
                    Logout
                </Button>
            </Flex>
        </Box>
    );

    const ChatList = () => {
        return (
            <Box w="250px" bg="gray.700" p={4} overflowY="auto" borderRight="1px solid #ccc">
                <VStack align="stretch">
                    {chatList.map(chat => (
                        <Button
                            key={chat.id}
                            variant={selectedChat === chat.id ? "solid" : "ghost"}
                            colorScheme="teal"
                            onClick={() => setSelectedChat(chat.id)}
                            justifyContent="start"
                        >
                            {chat.name}
                        </Button>
                    ))}
                </VStack>
            </Box>
        )
    }

    return (
        <Flex direction="column" h="100vh">
            <Header/>
            <Flex flex="1" overflow="hidden">
                <ChatList/>

                <Box flex="1" p={6} overflowY="auto">
                    <AnimatePresence mode="wait">
                        {selectedChat ? (
                            <Animate key={selectedChat}>
                                <Box>
                                    <Heading size="md">Chat
                                        with {chatList.find(c => c.id === selectedChat)?.name}</Heading>
                                </Box>
                            </Animate>
                        ) : (
                            <Animate key="empty">
                                <Text fontSize="xl" color="gray.500">Select chat</Text>
                            </Animate>
                        )}
                    </AnimatePresence>
                </Box>
            </Flex>
        </Flex>
    )
}

export default ChatPage;
