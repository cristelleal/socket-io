import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#2F3334',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 48,
    elevation: 8,
  },

  stateCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  paragraph: {
    fontFamily: 'Inter_700Bold',
    color: '#2F3334',
    fontSize: 18,
    letterSpacing: -0.5,
  },
  footnote: {
    fontFamily: 'Inter_400Regular',
    color: '#9BA0A0',
    fontSize: 13,
    textAlign: 'center',
  },
});
