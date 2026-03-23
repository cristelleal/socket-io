import { Text, TouchableOpacity } from "react-native";
import styles from './dice.styles';

const Dice = ({ index, locked, value, onPress, opponent }) => {

  const handlePress = () => {
    if (!opponent) {
      onPress(index);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.dice, locked && styles.lockedDice]}
      onPress={handlePress}
      disabled={opponent}
    >
      <Text style={styles.diceText}>{value}</Text>
    </TouchableOpacity>
  );
};

export default Dice;
