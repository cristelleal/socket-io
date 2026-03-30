import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  deckOpponentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 6,
    opacity: 0.6,
  },
  diceContainer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: '#9BA0A0',
    letterSpacing: 1,
    marginRight: 4,
  },
});
