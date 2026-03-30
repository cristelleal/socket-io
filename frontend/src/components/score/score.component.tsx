import { useState } from 'react';
import { Text, StyleProp, TextStyle } from 'react-native';
import useSocketEvent from '../../shared/hooks/useSocketEvent';

interface ScoreProps {
  scoreKey: 'myScore' | 'opponentScore';
  textStyle?: StyleProp<TextStyle>;
}

const Score = ({ scoreKey, textStyle }: ScoreProps) => {
  const [score, setScore] = useState(0);

  useSocketEvent('game.score.view-state', (data) => setScore(data[scoreKey]));

  return <Text style={textStyle}>{score}</Text>;
};

export default Score;
