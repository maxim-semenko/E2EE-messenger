import {useEffect, useState} from 'react'
import './App.css'
import {exportCryptoKeyToPEM, generateRSAKeyPair} from "./lib/keys.ts";
import WebSocketContext from "./context/WebSocketContext.ts";
import useWebSocket from "./hooks/useWebSocket.ts";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./components/HomePage.tsx";

function App() {
    const [isGenerated, setIsGenerated] = useState(false)

    useEffect(() => {
        if (!isGenerated) {
            generateRSAKeyPair().then(async keys => {
                console.log('Public Key:', keys.publicKey);
                console.log('Private Key:', keys.privateKey);
                const [publicPem, privatePem] = await Promise.all([exportCryptoKeyToPEM(keys.publicKey), exportCryptoKeyToPEM(keys.privateKey!)]);

                console.log("Public Key:\n", publicPem);
                console.log("Private Key:\n", privatePem);
                setIsGenerated(true);
            });
        }

    }, []);

    const {ws} = useWebSocket();

    if (!isGenerated) {
        return <h1>Loading...</h1>
    }

    return (
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
    )
}

export default App
