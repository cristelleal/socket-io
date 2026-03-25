import { View, Text } from 'react-native';
import Timer from '../timer/timer.component';
import OpponentDeck from '../decks/opponent-deck/opponent-deck.component';
import PlayerDeck from '../decks/player-deck/player-deck.component';
import Choices from '../choices/choices.component';
import Grid from '../grid/grid.component';
import styles from './board.styles';

const OpponentInfos = () => (
  <View style={styles.opponentInfosContainer}>
    <Text style={styles.infoText}>Adversaire</Text>
  </View>
);

const OpponentScore = () => (
  <View style={styles.opponentScoreContainer}>
    <Text style={styles.scoreText}>Score</Text>
  </View>
);

const PlayerInfos = () => (
  <View style={styles.playerInfosContainer}>
    <Text style={styles.infoText}>Joueur</Text>
  </View>
);

const PlayerScore = () => (
  <View style={styles.playerScoreContainer}>
    <Text style={styles.scoreText}>Score</Text>
  </View>
);

const Board = () => (
  <View style={styles.container}>
    <View style={styles.rowInfo}>
      <OpponentInfos />
      <View style={styles.opponentTimerScoreContainer}>
        <Timer timerKey="opponentTimer" />
        <OpponentScore />
      </View>
    </View>
    <View style={styles.rowDeck}>
      <OpponentDeck />
    </View>
    <View style={styles.rowMiddle}>
      <Grid />
      <Choices />
    </View>
    <View style={styles.rowDeck}>
      <PlayerDeck />
    </View>
    <View style={styles.rowInfo}>
      <PlayerInfos />
      <View style={styles.playerTimerScoreContainer}>
        <Timer timerKey="playerTimer" />
        <PlayerScore />
      </View>
    </View>
  </View>
);

export default Board;
