import {useEffect} from "react";
import {Route, Routes, useNavigate} from "react-router-dom";
import HomePage from "./HomePage";
import ChatPage from "./ChatPage";
import {useUserStore} from "@/store/userStore.ts";

const AppRoutes = () => {
    const setUser = useUserStore((state) => state.setUser);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = localStorage.getItem("currentUser");

        if (currentUser) {
            const {privateKey, publicKey, userId} = JSON.parse(currentUser);

            setUser({id: userId, privateKey, publicKey});
            navigate("/chat");
        } else {
            navigate("/");
        }
    }, [navigate, setUser]);

    return (
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/chat" element={<ChatPage/>}/>
        </Routes>
    );
};

export default AppRoutes;
