import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  deckPlayerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#e6dac7',
    backgroundColor: '#fdfaf5',
  },
  rollInfoContainer: {
    marginBottom: 10,
  },
  rollInfoText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#6c7f91',
  },
  diceContainer: {
    flexDirection: 'row',
    width: '70%',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rollButton: {
    width: '30%',
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cfe5f4',
    borderWidth: 1,
    borderColor: '#aacbdf',
  },
  rollButtonText: {
    fontSize: 18,
    color: '#304255',
    fontWeight: 'bold',
  },
});
