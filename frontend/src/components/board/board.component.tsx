import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Timer from '../timer/timer.component';
import Score from '../score/score.component';
import OpponentDeck from '../decks/opponent-deck/opponent-deck.component';
import PlayerDeck from '../decks/player-deck/player-deck.component';
import Choices from '../choices/choices.component';
import Grid from '../grid/grid.component';
import styles, { COLORS } from './board.styles';

interface BoardProps {
  playerUsername: string;
  opponentUsername: string;
  myPlayerKey: 'player:1' | 'player:2' | null;
  gameModeLabel?: string;
  onExitToMenu?: () => void;
}

const ScoreCard = ({ label, name, scoreKey, timerKey, isOpponent }: {
  label: string;
  name: string;
  scoreKey: 'myScore' | 'opponentScore';
  timerKey: 'playerTimer' | 'opponentTimer';
  isOpponent?: boolean;
}) => (
  <View style={[styles.scoreCard, isOpponent ? styles.scoreCardOpponent : styles.scoreCardPlayer]}>
    <View style={styles.scoreCardHeader}>
      <View>
        <Text style={styles.scoreCardLabel}>{label}</Text>
        <Text style={[styles.scoreCardName, isOpponent && styles.scoreCardNameOpponent]}>{name}</Text>
      </View>
      {isOpponent && <View style={styles.activeDot} />}
    </View>
    <View style={styles.scoreCardPointsRow}>
      <Score
        scoreKey={scoreKey}
        textStyle={[styles.scoreCardPoints, isOpponent && styles.scoreCardPointsOpponent]}
      />
      <Text style={styles.scoreCardUnit}>PTS</Text>
    </View>
    <Timer timerKey={timerKey} color={isOpponent ? COLORS.secondary : COLORS.primary} />
  </View>
);

const Board = ({
  playerUsername,
  opponentUsername,
  myPlayerKey,
  gameModeLabel = 'Game Board',
  onExitToMenu,
}: BoardProps) => {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS !== 'web' ? insets.top + 12 : 12;

  return (
  <View style={[styles.container, { paddingTop: topPadding }]}>

    <View style={styles.topBar}>
      <View style={styles.topBarLeft}>
        <View style={styles.modePill}>
          <Feather name="grid" size={13} color={COLORS.primary} />
          <Text style={styles.modePillText}>{gameModeLabel}</Text>
        </View>
        <Text style={styles.modeHint}>Align 5 pieces to win</Text>
      </View>
      {onExitToMenu && (
        <TouchableOpacity style={styles.backButton} onPress={onExitToMenu} activeOpacity={0.85}>
          <Feather name="arrow-left" size={14} color={COLORS.onSurface} />
          <Text style={styles.backButtonText}>Back to menu</Text>
        </TouchableOpacity>
      )}
    </View>

    <View style={styles.scoreboardRow}>
      <ScoreCard label="Player 01" name={playerUsername} scoreKey="myScore" timerKey="playerTimer" />
      <ScoreCard label="Player 02" name={opponentUsername} scoreKey="opponentScore" timerKey="opponentTimer" isOpponent />
    </View>

    <View style={styles.gridRow}>
      <Grid myPlayerKey={myPlayerKey} />
    </View>

    <View style={styles.bottomSection}>
      <View style={styles.opponentDeckRow}>
        <OpponentDeck />
      </View>

      <View style={styles.choicesRow}>
        <Choices />
      </View>

      <View style={styles.playerDeckRow}>
        <PlayerDeck />
      </View>
    </View>

  </View>
  );
};

export default Board;
