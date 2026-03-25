import express from 'express';
import { createServer } from 'http';
import { initSocket } from './bootstrap/socket';

const app = express();
const httpServer = createServer(app);

initSocket(httpServer);

httpServer.listen(3000, () => {
  console.log('listening on *:3000');
});
