import './App.css'
import WebSocketContext from "./context/WebSocketContext.ts";
import useWebSocket from "./hooks/useWebSocket.ts";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "@/components/ui/provider"
import UserContext, {type User} from "@/context/UserContext.ts";
import {useState} from "react";
import AppRoutes from "@/pages/AppRouters.tsx";


function App() {
    const [user, setUser] = useState<User | null>(null);
    const {ws} = useWebSocket();

    return (
        <Provider>
            <UserContext.Provider value={{user, setUser}}>
                <WebSocketContext.Provider value={ws}>
                    <BrowserRouter>
                        <AppRoutes/>
                    </BrowserRouter>
                </WebSocketContext.Provider>
            </UserContext.Provider>
        </Provider>
    );
}


export default App
