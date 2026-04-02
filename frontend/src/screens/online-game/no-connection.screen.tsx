import { View, Text, useWindowDimensions } from 'react-native';
import BottomNav from '../../components/bottom-nav/bottom-nav.component';
import styles from './online-game.styles';

export default function NoConnectionScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const content = (
    <View style={styles.stateCard}>
      <Text style={styles.paragraph}>No server connection</Text>
      <Text style={styles.footnote}>Restart the app and try again.</Text>
    </View>
  );

  if (isDesktop) {
    return (
      <View style={styles.container}>
        <View style={styles.desktopWrapper}>
          <View style={styles.desktopCard}>
            {content}
          </View>
          <BottomNav activeTab="play" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {content}
      <BottomNav activeTab="play" />
    </View>
  );
}
