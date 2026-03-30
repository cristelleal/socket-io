import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { initSocket } from './bootstrap/socket';
import { auth } from './modules/auth/auth';

const ALLOWED_ORIGINS = ['http://localhost:8081', 'http://localhost:19006'];

const app = express();

app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));

// Auth routes must be registered BEFORE express.json()
// because Better Auth reads the raw body itself
app.all('/api/auth/*', toNodeHandler(auth));

app.use(express.json());

const httpServer = createServer(app);

initSocket(httpServer);

httpServer.listen(3000, () => {
  console.log('listening on *:3000');
});
