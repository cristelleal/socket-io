import { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, TouchableOpacity, Text } from 'react-native';
import { SocketContext } from '../../shared/contexts/socket.context';
import { AppNavigationProp } from '../../shared/types/navigation.types';
import styles from './vs-bot-game.styles';

export default function VsBotGameScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const socket = useContext(SocketContext);

  return (
    <View style={styles.container}>
      {!socket && (
        <View style={styles.card}>
          <Text style={styles.paragraph}>No connection with server...</Text>
          <Text style={styles.footnote}>
            Restart the app and wait for the server to be back again.
          </Text>
        </View>
      )}

      {socket && (
        <View style={styles.card}>
          <Text style={styles.paragraph}>VsBot Game Interface</Text>
          <Text style={styles.footnote}>My socket id is: {socket.id}</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('HomeScreen')}
          >
            <Text style={styles.backButtonText}>Revenir au menu</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
