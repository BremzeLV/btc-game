import socket from "@/lib/socket";
import { useCallback, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

const useWebSocket = () => {
	const socketRef = useRef<Socket>();
    
    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = socket;
        }
    }, []);

    const reconnect = useCallback(() => { 
        socketRef.current.disconnect();
        socketRef.current.connect();
    }, [])

    return { socketRef, reconnect };
};

export default useWebSocket;
