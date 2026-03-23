import { useState } from "react";
import { View } from "react-native";
import useSocketEvent from "../../../../hooks/useSocketEvent";
import Dice from "../dice/dice.component";
import styles from './opponent-deck.styles';

const OpponentDeck = () => {
  const [displayOpponentDeck, setDisplayOpponentDeck] = useState(false);
  const [opponentDices, setOpponentDices] = useState(Array(5).fill({ value: "", locked: false }));

  useSocketEvent("game.deck.view-state", (data) => {
    setDisplayOpponentDeck(data['displayOpponentDeck']);
    if (data['displayOpponentDeck']) {
      setOpponentDices(data['dices']);
    }
  });

  return (
    <View style={styles.deckOpponentContainer}>
      {displayOpponentDeck && (
        <View style={styles.diceContainer}>
          {opponentDices.map((diceData, index) => (
            <Dice
              key={index}
              locked={diceData.locked}
              value={diceData.value}
              opponent={true}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default OpponentDeck;
