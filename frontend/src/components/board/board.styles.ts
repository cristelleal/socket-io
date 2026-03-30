import { StyleSheet } from 'react-native';

export const COLORS = {
  background: '#F9F9F9',
  surface: '#FFFFFF',
  surfaceContainerLow: '#F2F4F4',
  surfaceContainerHigh: '#E6E9E9',
  primary: '#645A7A',
  primaryContainer: '#E4D7FD',
  secondary: '#4B654E',
  secondaryContainer: '#CCEACD',
  tertiary: '#7C5649',
  tertiaryContainer: '#FFCCBC',
  onSurface: '#2F3334',
  onSurfaceVariant: '#5B6061',
  onSurfaceSubtle: '#9BA0A0',
  outlineVariant: '#AFB3B3',
  onPrimary: '#FDF7FF',
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },

  // Scoreboard
  scoreboardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  scoreCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    gap: 2,
  },
  scoreCardPlayer: {
    backgroundColor: COLORS.surfaceContainerLow,
  },
  scoreCardOpponent: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(175,179,179,0.15)',
    shadowColor: '#2F3334',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  scoreCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  scoreCardLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: COLORS.onSurfaceSubtle,
  },
  scoreCardName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 2,
  },
  scoreCardNameOpponent: {
    color: COLORS.secondary,
  },
  scoreCardPointsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 6,
  },
  scoreCardPoints: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 28,
    color: COLORS.primary,
    lineHeight: 32,
  },
  scoreCardPointsOpponent: {
    color: COLORS.secondary,
  },
  scoreCardUnit: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: COLORS.onSurfaceSubtle,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.secondary,
    marginTop: 4,
  },

  // Grid takes full width
  gridRow: {
    flex: 1,
  },

  // Bottom area: opponent deck / choices / player deck
  bottomSection: {
    gap: 10,
  },

  // Opponent deck row (compact, top-aligned)
  opponentDeckRow: {
    height: 52,
  },

  // Choices row
  choicesRow: {
    minHeight: 40,
  },

  // Player deck row
  playerDeckRow: {
    height: 64,
  },
});
