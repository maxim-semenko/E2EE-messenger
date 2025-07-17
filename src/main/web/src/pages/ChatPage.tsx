import {Flex} from "@chakra-ui/react";
import {useEffect} from "react";
import {ChatHeader} from "@/pages/chat/ChatHeader.tsx";
import {ChatList} from "@/pages/chat/ChatList.tsx";
import {CreateChatModal} from "@/pages/chat/CreateChatModal.tsx";
import {SelectedChat} from "@/pages/chat/SelectedChat.tsx";

import {useUserStore} from "@/store/userStore";
import {useChatStore} from "@/store/chatStore";

function ChatPage() {

    const user = useUserStore((state) => state.user);
    const loadChats = useChatStore((state) => state.loadChats);

    useEffect(() => {
        if (user) {
            loadChats(user);
        }
    }, [user]);

    return (
        <Flex direction="column" h="100vh">
            <CreateChatModal/>
            <ChatHeader/>
            <Flex flex="1" overflow="hidden">
                <ChatList/>
                <SelectedChat/>
            </Flex>
        </Flex>
    )
}

export default ChatPage;