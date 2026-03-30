import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  deckPlayerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  diceContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  rollInfoText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: '#9BA0A0',
    letterSpacing: 1,
  },
  rollButton: {
    backgroundColor: '#645A7A',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#645A7A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 3,
  },
  rollButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#FDF7FF',
  },
});
