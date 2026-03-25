import { Socket } from 'socket.io';
import { newPlayerInQueue } from './matchmaking.service';

export const registerMatchmakingHandlers = (socket: Socket): void => {
  socket.on('queue.join', () => {
    console.log(`[${socket.id}] new player in queue`);
    newPlayerInQueue(socket);
  });
};
