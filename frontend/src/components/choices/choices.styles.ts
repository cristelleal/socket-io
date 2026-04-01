import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  choicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  choiceButton: {
    backgroundColor: '#F2F4F4',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedChoice: {
    backgroundColor: '#E4D7FD',
  },
  disabledChoice: {
    opacity: 0.4,
  },
  choiceText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    color: '#2F3334',
  },
  defiDeclareButton: {
    backgroundColor: '#FFF3CD',
    borderWidth: 1,
    borderColor: '#F0AD4E',
  },
});
