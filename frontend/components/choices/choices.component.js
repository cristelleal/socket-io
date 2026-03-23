import { useState, useContext } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { SocketContext } from "../../contexts/socket.context";
import useSocketEvent from "../../hooks/useSocketEvent";
import styles from './choices.styles';

const Choices = () => {

    const socket = useContext(SocketContext);

    const [displayChoices, setDisplayChoices] = useState(false);
    const [canMakeChoice, setCanMakeChoice] = useState(false);
    const [idSelectedChoice, setIdSelectedChoice] = useState(null);
    const [availableChoices, setAvailableChoices] = useState([]);

    useSocketEvent("game.choices.view-state", (data) => {
        setDisplayChoices(data['displayChoices']);
        setCanMakeChoice(data['canMakeChoice']);
        setIdSelectedChoice(data['idSelectedChoice']);
        setAvailableChoices(data['availableChoices']);
    });

    const handleSelectChoice = (choiceId) => {
        if (canMakeChoice) {
            setIdSelectedChoice(choiceId);
            socket.emit("game.choices.selected", { choiceId });
        }
    };

    return (
        <View style={styles.choicesContainer}>
            {displayChoices &&
                availableChoices.map((choice) => (
                    <TouchableOpacity
                        key={choice.id}
                        style={[
                            styles.choiceButton,
                            idSelectedChoice === choice.id && styles.selectedChoice,
                            !canMakeChoice && styles.disabledChoice
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
