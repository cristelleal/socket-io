import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  choicesContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#e6dac7',
    backgroundColor: '#f7f0e4',
  },
  choiceButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '10%',
    borderWidth: 1,
    borderColor: '#e5d9c7',
  },
  selectedChoice: {
    backgroundColor: '#f7c5b7',
    borderColor: '#e8a796',
  },
  choiceText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#304255',
  },
  disabledChoice: {
    opacity: 0.5,
  },
});
