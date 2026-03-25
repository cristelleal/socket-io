import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf2',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e6dac7',
    backgroundColor: '#ffffff',
    padding: 16,
  },
  paragraph: {
    color: '#304255',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  footnote: {
    color: '#6f7f8f',
    marginBottom: 14,
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#f7c5b7',
    borderColor: '#e8a796',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  backButtonText: {
    color: '#304255',
    fontWeight: '700',
  },
});
