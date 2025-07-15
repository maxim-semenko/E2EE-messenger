import './App.css'
import WebSocketContext from "./context/WebSocketContext.ts";
import useWebSocket from "./hooks/useWebSocket.ts";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import {Provider} from "@/components/ui/provider"
import UserContext, {type User} from "@/context/UserContext.ts";
import {useEffect, useState} from "react";

function App() {

    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const privateKey = localStorage.getItem("privateKey");
        const publicKey = localStorage.getItem("publicKey");

        const user: User = {
            id: userId || "",
            privateKey: privateKey || "",
            publicKey: publicKey || ""
        }
        setUser(user)
    }, []);

    const {ws} = useWebSocket();


    return (
        <Provider>
            <UserContext.Provider value={{user, setUser}}>
                <WebSocketContext.Provider value={ws}>
                    <BrowserRouter>
                        {/*<nav style={{display: 'flex', gap: '1rem'}}>*/}
                        {/*    <Link to="/">Home</Link>*/}
                        {/*    <Link to="/about">About</Link>*/}
                        {/*</nav>*/}

                        <Routes>
                            <Route path="/" element={<HomePage/>}/>
                            {/*<Route path="/about" element={<AboutPage/>}/>*/}
                            {/*<Route path="*" element={<NotFoundPage />} />*/}
                        </Routes>
                    </BrowserRouter>
                </WebSocketContext.Provider>
            </UserContext.Provider>
        </Provider>
    )
}

export default App
