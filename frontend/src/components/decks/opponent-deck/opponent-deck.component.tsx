import { useState } from 'react';
import { View, Text } from 'react-native';
import useSocketEvent from '../../../shared/hooks/useSocketEvent';
import { Dice as DiceType } from '../../../shared/types/socket.types';
import Dice from '../dice/dice.component';
import styles from './opponent-deck.styles';

const OpponentDeck = () => {
  const [displayOpponentDeck, setDisplayOpponentDeck] = useState(false);
  const [opponentDices, setOpponentDices] = useState<DiceType[]>([]);

  useSocketEvent('game.deck.view-state', (data) => {
    setDisplayOpponentDeck(data.displayOpponentDeck);
    if (data.displayOpponentDeck) {
      setOpponentDices(data.dices);
    }
  });

  return (
    <View style={styles.deckOpponentContainer}>
      {displayOpponentDeck && (
        <>
          <Text style={styles.label}>OPP</Text>
          <View style={styles.diceContainer}>
            {opponentDices.map((diceData, index) => (
              <Dice
                key={index}
                locked={diceData.locked}
                value={diceData.value}
                opponent
              />
            ))}
          </View>
        </>
      )}
    </View>
  );
};

export default OpponentDeck;
