import React from 'react';
import { Platform } from 'react-native';
import { io } from 'socket.io-client';
import { AppSocket } from '../types/socket.types';

const socketEndpoint =
  Platform.OS === 'web'
    ? 'http://localhost:3000'
    : `http://${process.env.EXPO_PUBLIC_SOCKET_ENDPOINT}`;

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
