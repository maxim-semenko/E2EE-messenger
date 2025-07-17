import './App.css'
import WebSocketContext from "./context/WebSocketContext.ts";
import useWebSocket from "./hooks/useWebSocket.ts";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "@/ui/provider"
import AppRoutes from "@/pages/AppRouters.tsx";


function App() {
    const {ws} = useWebSocket();

    return (
        <Provider>
            <WebSocketContext.Provider value={ws}>
                <BrowserRouter>
                    <AppRoutes/>
                </BrowserRouter>
            </WebSocketContext.Provider>
        </Provider>
    );
}


export default App
