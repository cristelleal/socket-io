import { useState } from 'react';
import { View, Text } from 'react-native';
import useSocketEvent from '../../shared/hooks/useSocketEvent';
import styles from './timer.styles';

interface TimerProps {
  timerKey: 'playerTimer' | 'opponentTimer';
}

const Timer = ({ timerKey }: TimerProps) => {
  const [timer, setTimer] = useState(0);

  useSocketEvent('game.timer', (data) => setTimer(data[timerKey]));

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>Timer: {timer}</Text>
    </View>
  );
};

export default Timer;
