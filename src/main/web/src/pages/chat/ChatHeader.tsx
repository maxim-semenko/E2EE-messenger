import {Box, Button, Flex, Heading, Spacer} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {useUserStore} from "@/store/userStore.ts";
import {useChatStore} from "@/store/chatStore.ts";

export const ChatHeader = () => {
    const navigate = useNavigate();

    const setUser = useUserStore((state) => state.setUser);
    const resetChatStore = useChatStore((state) => state.reset);

    return (
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
    )

};
