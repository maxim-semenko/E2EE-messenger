import {createContext} from 'react';
import {StompWebSocketClient} from '../hooks/useWebSocket';

/**
 * Keep Web Socket connection
 * */
const WebSocketContext = createContext<StompWebSocketClient | null>(null);

export default WebSocketContext;