import { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../shared/database/prisma.client';

export type GameResultInput = {
  player1SocketId: string;
  player2SocketId: string;
  player1UserId?: string;
  player2UserId?: string;
  player1Score: number;
  player2Score: number;
  winner: string;
  endReason: 'ALIGNMENT' | 'PIECES_OUT' | 'TIMEOUT' | 'DISCONNECT';
};

export const GameRepository = {
  saveResult: async (data: GameResultInput): Promise<void> => {
    const record: Prisma.GameResultUncheckedCreateInput = {
      player1SocketId: data.player1SocketId,
      player2SocketId: data.player2SocketId,
      player1UserId:   data.player1UserId ?? null,
      player2UserId:   data.player2UserId ?? null,
      player1Score:    data.player1Score,
      player2Score:    data.player2Score,
      winner:          data.winner,
      endReason:       data.endReason,
    };
    await prisma.gameResult.create({ data: record });
  },
};
