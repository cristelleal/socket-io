import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  gridContainer: {
    flex: 7,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#2F3334',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 2,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(175,179,179,0.2)',
  },
  cellInner: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    color: '#2F3334',
  },
  topBorder: {
    borderTopWidth: 1,
  },
  leftBorder: {
    borderLeftWidth: 1,
  },
  // Token colors
  playerOwnedCell: {
    backgroundColor: '#E4D7FD',
  },
  opponentOwnedCell: {
    backgroundColor: '#CCEACD',
  },
  canBeCheckedCell: {
    backgroundColor: 'rgba(228,215,253,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(100,90,122,0.2)',
    borderStyle: 'dashed',
  },
  emptyCell: {
    backgroundColor: 'transparent',
  },
});
