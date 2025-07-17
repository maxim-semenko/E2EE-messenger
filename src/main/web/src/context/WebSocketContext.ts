import {createContext} from 'react';
import {StompWebSocketClient} from '../hooks/useWebSocket';

const WebSocketContext = createContext<StompWebSocketClient | null>(null);

export default WebSocketContext;