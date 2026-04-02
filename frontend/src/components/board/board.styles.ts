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
    backgroundColor: '#F6F7F7',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 12,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: -2,
  },
  topBarLeft: {
    gap: 4,
  },
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: COLORS.primaryContainer,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(100,90,122,0.12)',
  },
  modePillText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: COLORS.primary,
  },
  modeHint: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.onSurfaceSubtle,
    marginLeft: 2,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surface,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(175,179,179,0.28)',
    shadowColor: '#2F3334',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  backButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    color: COLORS.onSurface,
  },

  // Scoreboard
  scoreboardRow: {
    flexDirection: 'row',
    gap: 9,
  },
  scoreCard: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
    gap: 4,
  },
  scoreCardPlayer: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(100,90,122,0.14)',
    shadowColor: '#2F3334',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 9,
    elevation: 1,
  },
  scoreCardOpponent: {
    backgroundColor: '#F9FCF9',
    borderWidth: 1,
    borderColor: 'rgba(75,101,78,0.24)',
    shadowColor: '#2F3334',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
  },
  scoreCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  scoreCardLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 2.6,
    textTransform: 'uppercase',
    color: COLORS.onSurfaceSubtle,
  },
  scoreCardName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 1,
  },
  scoreCardNameOpponent: {
    color: COLORS.secondary,
  },
  scoreCardPointsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
    marginTop: 6,
  },
  scoreCardPoints: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 30,
    color: COLORS.primary,
    lineHeight: 34,
  },
  scoreCardPointsOpponent: {
    color: COLORS.secondary,
  },
  scoreCardUnit: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: COLORS.onSurfaceSubtle,
    marginBottom: 2,
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
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(175,179,179,0.12)',
    padding: 10,
    shadowColor: '#2F3334',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 2,
  },

  // Bottom area: opponent deck / choices / player deck
  bottomSection: {
    gap: 8,
    backgroundColor: '#FCFCFC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(175,179,179,0.12)',
    padding: 11,
    shadowColor: '#2F3334',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 1,
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
