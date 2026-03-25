import { useState, useContext } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { SocketContext } from '../../../shared/contexts/socket.context';
import useSocketEvent from '../../../shared/hooks/useSocketEvent';
import { Dice as DiceType } from '../../../shared/types/socket.types';
import Dice from '../dice/dice.component';
import styles from './player-deck.styles';

const PlayerDeck = () => {
  const socket = useContext(SocketContext);
  const [displayPlayerDeck, setDisplayPlayerDeck] = useState(false);
  const [dices, setDices] = useState<DiceType[]>([]);
  const [displayRollButton, setDisplayRollButton] = useState(false);
  const [rollsCounter, setRollsCounter] = useState(0);
  const [rollsMaximum, setRollsMaximum] = useState(3);

  useSocketEvent('game.deck.view-state', (data) => {
    setDisplayPlayerDeck(data.displayPlayerDeck);
    if (data.displayPlayerDeck) {
      setDisplayRollButton(data.displayRollButton);
      setRollsCounter(data.rollsCounter);
      setRollsMaximum(data.rollsMaximum);
      setDices(data.dices);
    }
  });

  const toggleDiceLock = (index: number) => {
    if (dices[index].value !== '' && displayRollButton) {
      socket?.emit('game.dices.lock', dices[index].id);
    }
  };

  const rollDices = () => {
    socket?.emit('game.dices.roll');
  };

  return (
    <View style={styles.deckPlayerContainer}>
      {displayPlayerDeck && (
        <>
          {displayRollButton && (
            <View style={styles.rollInfoContainer}>
              <Text style={styles.rollInfoText}>
                Lancer {rollsCounter} / {rollsMaximum}
              </Text>
            </View>
          )}

          <View style={styles.diceContainer}>
            {dices.map((diceData, index) => (
              <Dice
                key={diceData.id}
                index={index}
                locked={diceData.locked}
                value={diceData.value}
                onPress={toggleDiceLock}
              />
            ))}
          </View>

          {displayRollButton && (
            <TouchableOpacity style={styles.rollButton} onPress={rollDices}>
              <Text style={styles.rollButtonText}>Roll</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

export default PlayerDeck;
