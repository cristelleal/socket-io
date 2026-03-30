import { useState, useContext } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
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
            <TouchableOpacity style={styles.rollButton} onPress={rollDices} activeOpacity={0.85}>
              <Text style={styles.rollInfoText}>{rollsCounter}/{rollsMaximum}</Text>
              <Text style={styles.rollButtonText}>Roll</Text>
              <Feather name="shuffle" size={14} color="#FDF7FF" />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

export default PlayerDeck;
