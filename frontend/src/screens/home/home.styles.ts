import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf2',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: '#ffffff',
    borderColor: '#e6dac7',
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    shadowColor: '#8f826e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 3,
  },
  eyebrow: {
    color: '#8098ae',
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  title: {
    color: '#304255',
    fontWeight: '800',
    fontSize: 34,
    marginTop: 6,
  },
  subtitle: {
    color: '#607489',
    fontSize: 15,
    marginBottom: 14,
  },
  button: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginTop: 12,
  },
  buttonBlue: {
    backgroundColor: '#cfe5f4',
    borderColor: '#aacbdf',
  },
  buttonCoral: {
    backgroundColor: '#f7c5b7',
    borderColor: '#e8a796',
  },
  buttonTitle: {
    color: '#304255',
    fontSize: 17,
    fontWeight: '800',
  },
  buttonHint: {
    color: '#536b81',
    fontSize: 13,
    marginTop: 2,
  },
});
