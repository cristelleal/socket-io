import { StyleSheet } from 'react-native';

export const COLORS = {
  surface: '#FFFFFF',
  secondary: '#4B6550',
  secondaryContainer: '#D5F3D7',
  onSurface: '#2F3334',
};

export default StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: 'transparent',
  },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#2F3334',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },

  navItem: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  navItemActive: {
    backgroundColor: COLORS.secondaryContainer,
  },
  navLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: COLORS.onSurface,
  },
  navLabelActive: {
    color: COLORS.secondary,
  },
});
