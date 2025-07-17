import {Box, Button, Field, Flex, Heading, Spacer, Text, VStack} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {AnimatePresence} from "framer-motion";
import {Animate} from "@/components/Animate.tsx";
import {useEffect, useState} from "react";
import useWebSocket from "@/hooks/useWebSocket.ts";
import {type Message, MessageType} from "@/model/message.ts";
import {arrayBufferToBase64, encryptAES, encryptAESKey, generateAESKey, importRsaPublicKeyFromPem} from "@/lib/keys.ts";
import {Modal} from "@/components/Modal.tsx";
import {useUserStore} from "@/components/store/userStore";
import {useChatStore} from "@/components/store/chatStore";


function ChatPage() {
    const navigate = useNavigate();
    const {ws} = useWebSocket();

    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);

    const chats = useChatStore((state) => state.chats);
    const loadChats = useChatStore((state) => state.loadChats);
    const resetChatStore = useChatStore((state) => state.reset);
    const selectedChat = useChatStore((state) => state.selectedChat);
    const setSelectedChat = useChatStore((state) => state.setSelectedChat);


    const [openCreateChatModal, setOpenCreateChatModal] = useState(false);

    useEffect(() => {
        if (user) {
            loadChats(user);
        }
    }, [user]);


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
                            resetChatStore();
                            navigate("/");
                        }}>
                    Logout
                </Button>
            </Flex>
        </Box>
    );

    const createChat = async () => {

        const chatAESKey = await generateAESKey(128);
        const {cipher, iv} = await encryptAES("My chat", chatAESKey);
        const encryptedAESKey = await encryptAESKey(chatAESKey, await importRsaPublicKeyFromPem(user!.publicKey));

        const message = {
            sender: user?.id,
            receiver: user?.id,
            type: MessageType.CHAT,
            iv: arrayBufferToBase64(iv),
            content: `${arrayBufferToBase64(cipher)}::${arrayBufferToBase64(encryptedAESKey)}`,
        } as Message

        ws.sendMessages([message])
    }

    const ChatList = () => {
        return (
            <Box w="250px" bg="gray.700" p={4} overflowY="auto" borderRight="1px solid #ccc">
                <Button
                    colorScheme="teal"
                    onClick={() => setOpenCreateChatModal(true)}
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

    return (
        <Flex direction="column" h="100vh">
            {openCreateChatModal &&
                <Modal
                    title="Create chat"
                    size="xl"
                    isOpen={openCreateChatModal}
                    onClose={() => setOpenCreateChatModal(false)}
                    onConfirm={createChat}
                    showTrigger={false}
                >
                    <Field.Root>
                        <Field.Label>
                            Chat title
                        </Field.Label>
                    </Field.Root>
                </Modal>
            }
            <Header/>
            <Flex flex="1" overflow="hidden">
                <ChatList/>

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
            </Flex>
        </Flex>
    )
}

export default ChatPage;
