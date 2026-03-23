import { useEffect, useContext } from "react";
import { SocketContext } from "../contexts/socket.context";

const useSocketEvent = (event, handler) => {
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on(event, handler);
    return () => socket.off(event, handler);
  }, []);
};

export default useSocketEvent;
