import { StyleSheet } from 'react-native';

const COLORS = {
  background: '#F2F4F4',
  surface: '#FFFFFF',
  surfaceContainer: '#E6E9E9',
  surfaceContainerLow: '#ECEEF0',
  primary: '#645A7A',
  onPrimary: '#FFFFFF',
  onSurface: '#2F3334',
  onSurfaceVariant: '#5B6061',
  onSurfaceSubtle: '#9BA0A0',
  secondary: '#4B654E',
  error: '#A8364B',
};

export { COLORS };

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Desktop: centers the card vertically + horizontally
  desktopWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  // Desktop: white card with shadow
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
    paddingTop: 64,
    paddingBottom: 40,
  },

  // Header
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 48,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2F3334',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  logoDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  logoLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    color: COLORS.onSurface,
    textTransform: 'uppercase',
  },

  // Title
  titleSection: {
    marginBottom: 40,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.onSurface,
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 4,
    color: COLORS.onSurfaceSubtle,
    textTransform: 'uppercase',
  },

  // Mode switcher
  modeSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 16,
    padding: 6,
    marginBottom: 32,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
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
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.onSurfaceSubtle,
  },
  modeButtonTextActive: {
    color: COLORS.primary,
  },

  // Inputs
  inputsSection: {
    gap: 12,
    marginBottom: 24,
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
    width: 36,
    height: 36,
    borderRadius: 18,
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
    paddingVertical: 18,
  },
  inputHint: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    color: COLORS.onSurfaceSubtle,
    textTransform: 'uppercase',
  },

  // Error
  error: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.error,
    paddingHorizontal: 4,
    marginBottom: 8,
  },

  // Button
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 22,
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
    fontWeight: '700',
    letterSpacing: 3,
    color: COLORS.onPrimary,
    textTransform: 'uppercase',
  },
});
