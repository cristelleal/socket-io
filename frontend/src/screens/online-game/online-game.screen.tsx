import { useContext } from 'react';
import { View, Text } from 'react-native';
import { SocketContext } from '../../shared/contexts/socket.context';
import OnlineGameController from '../../modules/online-game/online-game.controller';
import styles from './online-game.styles';

export default function OnlineGameScreen() {
  const socket = useContext(SocketContext);

  return (
    <View style={styles.container}>
      {!socket && (
        <View style={styles.stateCard}>
          <Text style={styles.paragraph}>No connection with server...</Text>
          <Text style={styles.footnote}>
            Restart the app and wait for the server to be back again.
          </Text>
        </View>
      )}

      {socket && <OnlineGameController />}
    </View>
  );
}
