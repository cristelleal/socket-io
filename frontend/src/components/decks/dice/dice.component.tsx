import { Text, TouchableOpacity } from 'react-native';
import styles from './dice.styles';

interface DiceProps {
  index?: number;
  locked: boolean;
  value: string;
  onPress?: (index: number) => void;
  opponent?: boolean;
}

const Dice = ({ index, locked, value, onPress, opponent = false }: DiceProps) => {
  const handlePress = () => {
    if (!opponent && onPress !== undefined && index !== undefined) {
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
