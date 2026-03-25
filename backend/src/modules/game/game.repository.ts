import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type GameResultInput = {
  player1Id: string;
  player2Id: string;
  player1Score: number;
  player2Score: number;
  winner: string;
  endReason: 'ALIGNMENT' | 'PIECES_OUT' | 'TIMEOUT' | 'DISCONNECT';
};


export const GameRepository = {
  saveResult: async (data: GameResultInput): Promise<void> => {
    await prisma.gameResult.create({ data });
  },
};
