import { Game } from '../types';
import { Socket } from 'socket.io';

export const games: Game[] = [];
export const queue: Socket[] = [];
