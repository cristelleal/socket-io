import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { registerMatchmakingHandlers } from '../modules/matchmaking/matchmaking.handler';
import { registerGameHandlers } from '../modules/game/game.handler';

export const initSocket = (httpServer: HttpServer): void => {
  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    console.log(`[${socket.id}] socket connected`);

    registerMatchmakingHandlers(socket);
    registerGameHandlers(socket);

    socket.on('disconnect', (reason) => {
      console.log(`[${socket.id}] socket disconnected - ${reason}`);
    });
  });
};
