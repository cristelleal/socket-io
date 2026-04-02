import { useEffect, useContext, useRef } from 'react';
import { SocketContext } from '../contexts/socket.context';
import { ServerToClientEvents } from '../types/socket.types';

const useSocketEvent = <K extends keyof ServerToClientEvents>(
  event: K,
  handler: ServerToClientEvents[K]
): void => {
  const socket = useContext(SocketContext);
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!socket) return;

    const listener = (...args: unknown[]) => {
      (handlerRef.current as any)(...args);
    };

    socket.on(event as any, listener as any);
    return () => {
      socket.off(event as any, listener as any);
    };
  }, [socket, event]);
};

export default useSocketEvent;
