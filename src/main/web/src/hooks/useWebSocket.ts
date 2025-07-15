import {useEffect, useMemo} from 'react';
import {Client, type IMessage, type StompSubscription} from '@stomp/stompjs';

const DEFAULT_ENDPOINT = 'localhost:8080/ws';
const DEFAULT_TIMEOUT = 250;

export class StompWebSocketClient {
    #client: Client;

    constructor(url: string) {
        this.#client = new Client({
            brokerURL: this.#formatUrl(url),
            reconnectDelay: DEFAULT_TIMEOUT,
            // debug: (str) => console.log('[STOMP]', str),
            onConnect: () => {
                console.log('STOMP connected');
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame);
            },
            onWebSocketClose: (event) => {
                console.log('STOMP WebSocket closed:', event.reason);
            },
            onDisconnect: () => {
                console.log('STOMP disconnected');
            }
        });
    }

    #formatUrl(url: string) {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        return `${protocol}//${url}`;
    }

    connect() {
        this.#client.activate();
    }

    disconnect() {
        this.#client.deactivate();
    }

    isConnected() {
        return this.#client.connected;
    }

    subscribe(destination: string, callback: (message: IMessage) => void): StompSubscription | null {
        if (this.#client.connected) {
            return this.#client.subscribe(destination, callback);
        } else {
            console.warn("Tried to subscribe while STOMP is not connected");
            return null;
        }
    }

    send(destination: string, body: string, headers = {}) {
        if (this.#client.connected) {
            this.#client.publish({destination, body, headers});
        } else {
            console.warn("Cannot send STOMP message, not connected");
        }
    }
}

function useWebSocket() {
    const ws = useMemo(() => {
        return new StompWebSocketClient(DEFAULT_ENDPOINT);
    }, []);

    useEffect(() => {
        ws.connect();
        return () => {
            ws.disconnect();
        };
    }, [ws]);

    return {ws};
}

export default useWebSocket;
