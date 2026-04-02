import { useState, useContext } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { SocketContext } from '../../shared/contexts/socket.context';
import useSocketEvent from '../../shared/hooks/useSocketEvent';
import { Combination } from '../../shared/types/socket.types';
import styles from './choices.styles';

const Choices = () => {
  const socket = useContext(SocketContext);
  const [displayChoices, setDisplayChoices] = useState(false);
  const [canMakeChoice, setCanMakeChoice] = useState(false);
  const [canDeclareDefi, setCanDeclareDefi] = useState(false);
  const [idSelectedChoice, setIdSelectedChoice] = useState<string | null>(null);
  const [availableChoices, setAvailableChoices] = useState<Combination[]>([]);

  useSocketEvent('game.choices.view-state', (data) => {
    setDisplayChoices(data.displayChoices);
    setCanMakeChoice(data.canMakeChoice);
    setCanDeclareDefi(data.canDeclareDefi);
    setIdSelectedChoice(data.idSelectedChoice);
    setAvailableChoices(data.availableChoices);
  });

  const handleSelectChoice = (choiceId: string) => {
    if (canMakeChoice) {
      setIdSelectedChoice(choiceId);
      socket?.emit('game.choices.selected', { choiceId });
    }
  };

  const handleDeclareDefi = () => {
    socket?.emit('game.defi.declare');
  };

  return (
    <View style={styles.choicesContainer}>
      {canDeclareDefi && (
        <TouchableOpacity
          style={[styles.choiceButton, styles.defiDeclareButton]}
          onPress={handleDeclareDefi}
        >
          <Text style={styles.choiceText}>Defi</Text>
        </TouchableOpacity>
      )}
      {displayChoices &&
        availableChoices.map((choice) => (
          <TouchableOpacity
            key={choice.id}
            style={[
              styles.choiceButton,
              idSelectedChoice === choice.id && styles.selectedChoice,
              !canMakeChoice && styles.disabledChoice,
            ]}
            onPress={() => handleSelectChoice(choice.id)}
            disabled={!canMakeChoice}
          >
            <Text style={styles.choiceText}>{choice.value}</Text>
          </TouchableOpacity>
        ))}
    </View>
  );
};

export default Choices;
