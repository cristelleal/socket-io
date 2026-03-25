import { useState } from 'react';
import { View, Text } from 'react-native';
import useSocketEvent from '../../shared/hooks/useSocketEvent';
import styles from './score.styles';

interface ScoreProps {
  scoreKey: 'myScore' | 'opponentScore';
}

const Score = ({ scoreKey }: ScoreProps) => {
  const [score, setScore] = useState(0);

  useSocketEvent('game.score.view-state', (data) => setScore(data[scoreKey]));

  return (
    <View style={styles.container}>
      <Text style={styles.scoreText}>{score} pt{score > 1 ? 's' : ''}</Text>
    </View>
  );
};

export default Score;
