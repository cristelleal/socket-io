import { useState } from 'react';
import { Text } from 'react-native';
import useSocketEvent from '../../shared/hooks/useSocketEvent';
import styles from './timer.styles';

interface TimerProps {
  timerKey: 'playerTimer' | 'opponentTimer';
  color?: string;
}

const Timer = ({ timerKey, color }: TimerProps) => {
  const [timer, setTimer] = useState(0);

  useSocketEvent('game.timer', (data) => setTimer(data[timerKey]));

  return (
    <Text style={[styles.timerText, color ? { color } : undefined]}>
      {timer}s
    </Text>
  );
};

export default Timer;
