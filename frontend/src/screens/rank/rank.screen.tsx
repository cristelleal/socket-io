import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNav from '../../components/bottom-nav/bottom-nav.component';
import { SocketContext } from '../../shared/contexts/socket.context';
import styles, { COLORS } from './rank.screen.styles';

type LeaderboardEntry = {
  rank: number;
  userId: string;
  displayName: string;
  totalScore: number;
  gamesPlayed: number;
  wins: number;
  averageScore: number;
  bestScore: number;
  lastPlayedAt: string;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export default function RankScreen() {
  const socket = useContext(SocketContext);
  const isWeb = Platform.OS === 'web';
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedFromHttp, setHasLoadedFromHttp] = useState(false);
  const topThree = useMemo(() => entries.slice(0, 3), [entries]);

  const loadLeaderboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/rank/leaderboard?limit=3`);
      const payload = await response.json();
      setEntries(payload.leaderboard ?? []);
      setGeneratedAt(payload.generatedAt ?? null);
      setHasLoadedFromHttp(true);
    } catch (error) {
      if (socket) socket.emit('leaderboard.request', { limit: 3 });
    } finally {
      setIsLoading(false);
    }
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const onLeaderboardData = (payload: { leaderboard: LeaderboardEntry[]; generatedAt: string }) => {
      if (hasLoadedFromHttp && payload.leaderboard.length > 0) return;
      setEntries(payload.leaderboard);
      setGeneratedAt(payload.generatedAt);
    };

    socket.on('leaderboard.data', onLeaderboardData);
    void loadLeaderboard();

    return () => {
      socket.off('leaderboard.data', onLeaderboardData);
    };
  }, [socket, loadLeaderboard, hasLoadedFromHttp]);

  const updatedAtText = useMemo(() => {
    if (!generatedAt) return 'Updated: -';
    return `Updated: ${new Date(generatedAt).toLocaleString()}`;
  }, [generatedAt]);

  const mobileCards = topThree;

  const content = (
    <>
      <View style={styles.heroCard}>
        <Text style={styles.eyebrow}>Archive No. 02</Text>
        <Text style={styles.titleHall}>Hall of</Text>
        <Text style={styles.titleFame}>Fame</Text>
        <Text style={styles.tagline}>Top 3 players from recorded game results, sorted by total score.</Text>

        <View style={styles.shapesRow}>
          <View style={styles.shapeCircle} />
          <View style={styles.shapeRect} />
          <View style={styles.shapeWide} />
        </View>
      </View>

      <View style={styles.headerRow}>
        <Text style={styles.updatedAt}>{updatedAtText}</Text>
        <TouchableOpacity style={styles.refreshButton} activeOpacity={0.85} onPress={loadLeaderboard}>
          <Feather name="refresh-cw" size={14} color={COLORS.onSurface} />
          <Text style={styles.refreshText}>{isLoading ? 'Loading' : 'Refresh'}</Text>
        </TouchableOpacity>
      </View>

      {topThree.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No ranked players yet</Text>
          <Text style={styles.emptyText}>The hall of fame will appear once authenticated users finish games and scores are persisted.</Text>
        </View>
      ) : (
        <View style={styles.mobileList}>
          {mobileCards.map(entry => (
            <View
              key={entry.userId}
              style={[
                styles.mobileCard,
                entry.rank === 1 && styles.mobileCardGold,
              ]}
            >
              <View style={styles.mobileCardTop}>
                <View style={styles.rankPill}>
                  <Feather name={entry.rank === 1 ? 'award' : 'bar-chart-2'} size={12} color={COLORS.secondary} />
                  <Text style={styles.rankPillText}>#{entry.rank}</Text>
                </View>
                <Text style={styles.playerName}>{entry.displayName}</Text>
              </View>

              <View style={styles.mobileScoreRow}>
                <Text style={styles.mobileScore}>{entry.totalScore}</Text>
                <Text style={styles.scoreLabel}>Total score</Text>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statChip}>
                  <Text style={styles.statLabel}>Games</Text>
                  <Text style={styles.statValue}>{entry.gamesPlayed}</Text>
                </View>
                <View style={styles.statChip}>
                  <Text style={styles.statLabel}>Wins</Text>
                  <Text style={styles.statValue}>{entry.wins}</Text>
                </View>
                <View style={styles.statChip}>
                  <Text style={styles.statLabel}>Best</Text>
                  <Text style={styles.statValue}>{entry.bestScore}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </>
  );

  if (!isWeb) {
    return (
      <View style={styles.screen}>
        <View style={styles.contentArea}>
          <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContentMobile, { paddingTop: insets.top + 16 }]} showsVerticalScrollIndicator={false}>
            {content}
          </ScrollView>
        </View>
        <BottomNav activeTab="rank" />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { height, maxHeight: height, overflow: 'hidden' }]}>
      <View style={styles.contentArea}>
        <ScrollView style={[styles.scrollView, { maxHeight: height }]} contentContainerStyle={styles.scrollContentWeb} showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      </View>
      <BottomNav activeTab="rank" absolute />
    </View>
  );
}
