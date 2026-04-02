import { Socket } from 'socket.io';
import { RankRepository } from './rank.repository';

export const registerRankHandlers = (socket: Socket): void => {
  socket.on('leaderboard.request', async (data?: { limit?: number }) => {
    try {
      const leaderboard = await RankRepository.getLeaderboard(data?.limit ?? 30);
      socket.emit('leaderboard.data', {
        leaderboard,
        generatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[RankRepository] Failed to load leaderboard:', error);
      socket.emit('leaderboard.data', {
        leaderboard: [],
        generatedAt: new Date().toISOString(),
      });
    }
  });
};
