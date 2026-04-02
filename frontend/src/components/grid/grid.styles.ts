import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  gridContainer: {
    flex: 7,
    backgroundColor: '#FAFBFB',
    borderRadius: 22,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(175,179,179,0.2)',
    shadowColor: '#2F3334',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 22,
    elevation: 4,
  },
  gridHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  legendItem: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(242,244,244,0.9)',
  },
  legendDotPlayer: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#E4D7FD',
  },
  legendDotOpponent: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#CCEACD',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(175,179,179,0.22)',
  },
  pressableCell: {
    backgroundColor: 'rgba(100,90,122,0.03)',
  },
  cellInner: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  altCell: {
    backgroundColor: 'rgba(242,244,244,0.72)',
  },
  cellText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    letterSpacing: 0.15,
    color: '#2F3334',
  },
  topBorder: {
    borderTopWidth: 1,
  },
  leftBorder: {
    borderLeftWidth: 1,
  },
  middleRowLine: {
    borderTopColor: 'rgba(100,90,122,0.24)',
  },
  middleColLine: {
    borderLeftColor: 'rgba(100,90,122,0.24)',
  },
  // Token colors
  playerOwnedCell: {
    backgroundColor: '#E4D7FD',
    borderColor: 'rgba(100,90,122,0.26)',
    shadowColor: '#645A7A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  opponentOwnedCell: {
    backgroundColor: '#CCEACD',
    borderColor: 'rgba(75,101,78,0.26)',
    shadowColor: '#4B654E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  canBeCheckedCell: {
    backgroundColor: 'rgba(228,215,253,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(100,90,122,0.36)',
    borderStyle: 'dashed',
    shadowColor: '#645A7A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 1,
  },
  removableCell: {
    backgroundColor: 'rgba(254,194,162,0.45)',
    borderColor: 'rgba(124,86,73,0.42)',
    shadowColor: '#7C5649',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 1,
  },
  emptyCell: {
    backgroundColor: 'transparent',
  },
});
