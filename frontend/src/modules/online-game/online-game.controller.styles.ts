import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  stateCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  paragraph: {
    fontFamily: 'Inter_700Bold',
    color: '#2F3334',
    fontSize: 16,
    marginBottom: 8,
  },
  footnote: {
    fontFamily: 'Inter_400Regular',
    color: '#9BA0A0',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
  },
  actionButtonText: {
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    fontSize: 14,
  },
});
