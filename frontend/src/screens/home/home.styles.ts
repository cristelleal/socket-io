import { StyleSheet } from 'react-native';

export const COLORS = {
  background: '#F9F9F9',
  surface: '#FFFFFF',
  surfaceContainerLow: '#F3F4F4',
  surfaceContainer: '#ECEEEE',
  primary: '#64578B',
  onPrimary: '#FDF7FF',
  primaryContainer: '#D0C1FC',
  secondary: '#4B6550',
  onSecondary: '#E8FFE8',
  secondaryContainer: '#D5F3D7',
  tertiary: '#81543B',
  onTertiary: '#FFF7F5',
  tertiaryContainer: '#FEC2A2',
  onSurface: '#2F3334',
  onSurfaceVariant: '#5C6060',
  onSurfaceSubtle: '#9BA0A0',
  outlineVariant: '#AFB2B3',
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Desktop layout
  desktopWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  desktopCard: {
    width: '100%',
    maxWidth: 560,
    maxHeight: '90%',
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

  scrollContent: {
    flexGrow: 1,
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 140,
  },

  // Branding
  eyebrow: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 4,
    color: COLORS.primary,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  titleYam: {
    fontFamily: 'Inter_700Bold',
    fontSize: 72,
    fontWeight: '800',
    lineHeight: 66,
    letterSpacing: -3,
    color: COLORS.onSurface,
  },
  titleMaster: {
    fontFamily: 'Inter_700Bold',
    fontSize: 72,
    fontWeight: '800',
    lineHeight: 66,
    letterSpacing: -3,
    color: COLORS.tertiary,
  },
  tagline: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
    color: COLORS.onSurfaceVariant,
    marginTop: 16,
    maxWidth: 260,
  },

  // Bauhaus shapes
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

  // Menu items
  menuList: {
    gap: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  menuItemPrimary: {
    backgroundColor: COLORS.surface,
    shadowColor: '#2F3334',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
  },
  menuItemSecondary: {
    backgroundColor: COLORS.surfaceContainerLow,
  },
  menuItemLeft: {
    gap: 4,
  },
  menuItemCode: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    color: COLORS.onSurfaceSubtle,
    textTransform: 'uppercase',
  },
  menuItemLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: COLORS.onSurface,
    textTransform: 'uppercase',
  },

  // Footer line
  footerLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 32,
    opacity: 0.5,
  },
  footerDash: {
    width: 48,
    height: 1,
    backgroundColor: COLORS.outlineVariant,
  },
  footerText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: COLORS.onSurfaceVariant,
  },

  // Bottom nav
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#2F3334',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  navItemActive: {
    backgroundColor: COLORS.secondaryContainer,
  },
  navLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: COLORS.onSurface,
  },
  navLabelActive: {
    color: COLORS.secondary,
  },
});
