import { View, TouchableOpacity, Text } from "react-native";
import styles from './home.styles';

export default function HomeScreen({ navigation }) {

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Yatzy Club</Text>
        <Text style={styles.title}>Lance les des</Text>
        <Text style={styles.subtitle}>Simple, doux, et competitif.</Text>

        <TouchableOpacity
          style={[styles.button, styles.buttonBlue]}
          onPress={() => navigation.navigate('OnlineGameScreen')}
        >
          <Text style={styles.buttonTitle}>Jouer en ligne</Text>
          <Text style={styles.buttonHint}>Match rapide avec un joueur.</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonCoral]}
          onPress={() => navigation.navigate('VsBotGameScreen')}
        >
          <Text style={styles.buttonTitle}>Jouer contre le bot</Text>
          <Text style={styles.buttonHint}>Mode detente et entrainement.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
