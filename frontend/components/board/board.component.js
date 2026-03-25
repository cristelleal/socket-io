import { View, Text } from 'react-native';
import Timer from '../timers/timer.component';
import OpponentDeck from '../decks/opponent-deck/opponent-deck.component';
import PlayerDeck from '../decks/player-deck/player-deck.component';
import Choices from '../choices/choices.component';
import Grid from '../grid/grid.component';
import styles from './board.styles';

const OpponentInfos = () => {
    return (
        <View style={styles.opponentInfosContainer}>
            <Text style={styles.infoText}>Adversaire</Text>
        </View>
    );
};

const OpponentScore = () => {
    return (
        <View style={styles.opponentScoreContainer}>
            <Text style={styles.scoreText}>Score</Text>
        </View>
    );
};


const PlayerInfos = () => {
    return (
        <View style={styles.playerInfosContainer}>
            <Text style={styles.infoText}>Joueur</Text>
        </View>
    );
};

const PlayerScore = () => {

    return (
        <View style={styles.playerScoreContainer}>
            <Text style={styles.scoreText}>Score</Text>
        </View>
    );
};



const Board = () => {
    return (
        <View style={styles.container}>
            <View style={[styles.row, { height: '5%' }]}>
                <OpponentInfos />
                <View style={styles.opponentTimerScoreContainer}>
                    <Timer timerKey="opponentTimer" />
                    <OpponentScore />
                </View>
            </View>
            <View style={[styles.row, { height: '25%' }]}>
                <OpponentDeck />
            </View>
            <View style={[styles.row, { height: '40%' }]}>
                <Grid />
                <Choices />
            </View>
            <View style={[styles.row, { height: '25%' }]}>
                <PlayerDeck />
            </View>
            <View style={[styles.row, { height: '5%' }]}>
                <PlayerInfos />
                <View style={styles.playerTimerScoreContainer}>
                    <Timer timerKey="playerTimer" />
                    <PlayerScore />
                </View>
            </View>
        </View>
    );
};

export default Board;
