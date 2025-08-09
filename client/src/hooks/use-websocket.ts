import socket from "@/lib/socket";
import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

const useWebSocket = () => {
	const socketRef = useRef<Socket>();
    
    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = socket;
        
            socket.on("connect", () => {
                console.log(
                    "Succesfully connected to server WebSocket:",
                    socket.id
                );
            });
        }

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    return { socketRef };
};

export default useWebSocket;
