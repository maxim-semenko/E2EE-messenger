import {useEffect} from "react";
import {Route, Routes, useNavigate} from "react-router-dom";
import HomePage from "./HomePage";
import ChatPage from "./ChatPage";
import {useUser} from "@/context/UserContext.ts";

const AppRoutes = () => {
    const {setUser} = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const privateKey = localStorage.getItem("privateKey");
        const publicKey = localStorage.getItem("publicKey");

        if (userId && privateKey && publicKey) {
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
