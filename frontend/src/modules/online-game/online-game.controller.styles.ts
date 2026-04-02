import { StyleSheet } from 'react-native';

export const COLORS = {
  background: '#F9F9F9',
  surface: '#FFFFFF',
  surfaceContainerLow: '#F3F4F4',
  primary: '#64578B',
  primaryContainer: '#D0C1FC',
  secondary: '#4B6550',
  secondaryContainer: '#D5F3D7',
  tertiary: '#81543B',
  tertiaryContainer: '#FEC2A2',
  onSurface: '#2F3334',
  onSurfaceVariant: '#5C6060',
  onSurfaceSubtle: '#9BA0A0',
  outlineVariant: '#AFB2B3',
};

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  desktopWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  desktopCard: {
    width: '100%',
    maxWidth: 560,
    maxHeight: '90%' as any,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#2F3334',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 48,
    elevation: 8,
  },
  desktopScroll: {
    paddingTop: 40,
    paddingHorizontal: 40,
    paddingBottom: 120,
  },

  centeredContent: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  eyebrow: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 4,
    color: COLORS.primary,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 56,
    lineHeight: 52,
    letterSpacing: -2,
    color: COLORS.onSurface,
  },
  titleAccent: {
    color: COLORS.secondary,
  },

  shapesRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginTop: 28,
    marginBottom: 40,
  },
  shapeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryContainer,
  },
  shapeRect: {
    width: 32,
    height: 64,
    borderRadius: 8,
    backgroundColor: COLORS.secondaryContainer,
  },
  shapeWide: {
    width: 64,
    height: 32,
    borderRadius: 6,
    backgroundColor: COLORS.tertiaryContainer,
  },

  stateCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 32,
    gap: 12,
    alignItems: 'center',
    shadowColor: '#2F3334',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 32,
    elevation: 4,
  },
  paragraph: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    letterSpacing: -0.5,
    color: COLORS.onSurface,
    textAlign: 'center',
  },
  footnote: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
  },

  resultCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 32,
    gap: 12,
    shadowColor: '#2F3334',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 32,
    elevation: 4,
  },
  resultIconRow: {
    alignItems: 'center',
    marginBottom: 4,
  },
  resultTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    letterSpacing: -1,
    color: COLORS.onSurface,
    textAlign: 'center',
  },
  resultDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#FDF7FF',
  },
});
