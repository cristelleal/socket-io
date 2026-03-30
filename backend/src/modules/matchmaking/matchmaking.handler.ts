import { Socket } from 'socket.io';
import { newPlayerInQueue } from './matchmaking.service';

export const registerMatchmakingHandlers = (socket: Socket): void => {
  socket.on('queue.join', (data?: { userId?: string; username?: string }) => {
    console.log(`[${socket.id}] new player in queue (${data?.username ?? 'anonymous'})`);
    newPlayerInQueue({ socket, userId: data?.userId, username: data?.username });
  });
};
