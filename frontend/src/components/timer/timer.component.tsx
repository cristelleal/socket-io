import { useState } from 'react';
import { Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import useSocketEvent from '../../shared/hooks/useSocketEvent';
import styles from './timer.styles';

interface TimerProps {
  timerKey: 'playerTimer' | 'opponentTimer';
  color?: string;
}

const Timer = ({ timerKey, color }: TimerProps) => {
  const [timer, setTimer] = useState(0);

  useSocketEvent('game.timer', (data) => {
    const value = Number(data?.[timerKey]);
    setTimer(Number.isFinite(value) ? Math.max(0, value) : 0);
  });

  const minutes = Math.floor(timer / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (timer % 60)
    .toString()
    .padStart(2, '0');

  return (
    <View style={styles.timerChip}>
      <Feather name="clock" size={11} color={color ?? '#9BA0A0'} />
      <Text style={[styles.timerText, color ? { color } : undefined]}>
        {minutes}:{seconds}
      </Text>
    </View>
  );
};

export default Timer;
