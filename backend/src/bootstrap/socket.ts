import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { registerMatchmakingHandlers } from '../modules/matchmaking/matchmaking.handler';
import { registerGameHandlers } from '../modules/game/game.handler';
import { registerBotHandlers } from '../modules/bot/bot.handler';

export const initSocket = (httpServer: HttpServer): void => {
  const io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:8081', 'http://localhost:19006'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`[${socket.id}] socket connected`);

    registerMatchmakingHandlers(socket);
    registerGameHandlers(socket);
    registerBotHandlers(socket);

    socket.on('disconnect', (reason) => {
      console.log(`[${socket.id}] socket disconnected - ${reason}`);
    });
  });
};
