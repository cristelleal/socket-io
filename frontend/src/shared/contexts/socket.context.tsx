import React from 'react';
import { io } from 'socket.io-client';
import { AppSocket } from '../types/socket.types';

const socketEndpoint = process.env.EXPO_PUBLIC_SOCKET_URL ?? 'http://localhost:3000';

export const socket: AppSocket = io(socketEndpoint, {
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('connect: ', socket.id);
});

socket.on('disconnect', () => {
  console.log('disconnected from server');
  socket.removeAllListeners();
});

export const SocketContext = React.createContext<AppSocket | null>(null);
