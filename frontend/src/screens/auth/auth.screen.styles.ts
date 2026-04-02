import { StyleSheet } from 'react-native';

export const COLORS = {
  background: '#F9F9F9',
  surface: '#FFFFFF',
  surfaceContainerLow: '#F3F4F4',
  primary: '#64578B',
  primaryContainer: '#D0C1FC',
  onPrimary: '#FDF7FF',
  secondary: '#4B6550',
  secondaryContainer: '#D5F3D7',
  tertiary: '#81543B',
  tertiaryContainer: '#FEC2A2',
  onSurface: '#2F3334',
  onSurfaceVariant: '#5C6060',
  onSurfaceSubtle: '#9BA0A0',
  outlineVariant: '#AFB2B3',
  error: '#A8364B',
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ── Desktop layout ────────────────────────────────────────────────────────
  desktopWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  desktopCard: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 48,
    shadowColor: '#2F3334',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 48,
    elevation: 8,
  },
  inner: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 40,
  },

  // ── Branding ──────────────────────────────────────────────────────────────
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
  },
  logoLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 4,
    color: COLORS.onSurface,
    textTransform: 'uppercase',
  },
  logoLabelAccent: {
    color: COLORS.tertiary,
  },

  // ── Title (home-style two-line) ───────────────────────────────────────────
  titleLine1: {
    fontFamily: 'Inter_700Bold',
    fontSize: 64,
    fontWeight: '800',
    lineHeight: 60,
    letterSpacing: -3,
    color: COLORS.onSurface,
  },
  titleLine2: {
    fontFamily: 'Inter_700Bold',
    fontSize: 64,
    fontWeight: '800',
    lineHeight: 60,
    letterSpacing: -3,
    color: COLORS.tertiary,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.onSurfaceVariant,
    marginBottom: 4,
    maxWidth: 260,
  },

  // ── Bauhaus shapes ────────────────────────────────────────────────────────
  shapesRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginTop: 16,
    marginBottom: 32,
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

  // ── Mode switcher ─────────────────────────────────────────────────────────
  modeSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 16,
    padding: 6,
    marginBottom: 24,
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  modeButtonActive: {
    backgroundColor: COLORS.surface,
    shadowColor: '#2F3334',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  modeButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: COLORS.onSurfaceSubtle,
  },
  modeButtonTextActive: {
    color: COLORS.primary,
  },

  // ── Inputs ────────────────────────────────────────────────────────────────
  inputsSection: {
    gap: 10,
    marginBottom: 20,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 14,
  },
  inputIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2F3334',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
    flexShrink: 0,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: COLORS.onSurface,
    paddingVertical: 16,
  },
  inputHint: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 2,
    color: COLORS.onSurfaceSubtle,
    textTransform: 'uppercase',
  },

  // ── Error ─────────────────────────────────────────────────────────────────
  error: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.error,
    paddingHorizontal: 4,
    marginBottom: 8,
  },

  // ── CTA button ────────────────────────────────────────────────────────────
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 4,
  },
  buttonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    letterSpacing: 3,
    color: COLORS.onPrimary,
    textTransform: 'uppercase',
  },
});
