import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  gridContainer: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#f9f5ee',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    flexDirection: 'row',
    flex: 2,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e3d7c5',
    backgroundColor: '#ffffff',
  },
  cellText: {
    fontSize: 12,
    color: '#304255',
    fontWeight: '700',
  },
  playerOwnedCell: {
    backgroundColor: '#cfe5f4',
  },
  opponentOwnedCell: {
    backgroundColor: '#f7c5b7',
  },
  canBeCheckedCell: {
    backgroundColor: '#f7f0e4',
  },
  topBorder: {
    borderTopWidth: 1,
  },
  leftBorder: {
    borderLeftWidth: 1,
  },
});
