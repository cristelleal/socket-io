import { useEffect, useContext } from 'react';
import { SocketContext } from '../contexts/socket.context';
import { ServerToClientEvents } from '../types/socket.types';

const useSocketEvent = <K extends keyof ServerToClientEvents>(
  event: K,
  handler: ServerToClientEvents[K]
): void => {
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;
    socket.on(event as any, handler as any);
    return () => { socket.off(event as any, handler as any); };
  }, []);
};

export default useSocketEvent;
