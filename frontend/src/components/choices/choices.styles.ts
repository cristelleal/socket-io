import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  choicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  choiceButton: {
    backgroundColor: '#F5F6F6',
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(175,179,179,0.18)',
  },
  selectedChoice: {
    backgroundColor: '#E4D7FD',
    borderColor: 'rgba(100,90,122,0.28)',
  },
  disabledChoice: {
    opacity: 0.45,
  },
  choiceText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 0.4,
    color: '#2F3334',
  },
  defiDeclareButton: {
    backgroundColor: '#FFF1C9',
    borderWidth: 1,
    borderColor: '#E3A852',
  },
});
