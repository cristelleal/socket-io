import { useContext } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { SocketContext } from '../../shared/contexts/socket.context';
import OnlineGameController from '../../modules/online-game/online-game.controller';
import styles from './online-game.styles';

export default function OnlineGameScreen() {
  const socket = useContext(SocketContext);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const content = !socket ? (
    <View style={styles.stateCard}>
      <Text style={styles.paragraph}>No connection with server...</Text>
      <Text style={styles.footnote}>Restart the app and wait for the server to be back again.</Text>
    </View>
  ) : (
    <OnlineGameController />
  );

  if (isDesktop) {
    return (
      <View style={styles.container}>
        <View style={styles.desktopWrapper}>
          <View style={styles.desktopCard}>
            {content}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {content}
    </View>
  );
}
