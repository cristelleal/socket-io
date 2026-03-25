import { useState, useContext, useEffect } from "react";
import { View, Text } from "react-native";
import { SocketContext } from "../../contexts/socket.context";
import styles from './player-timer.styles';

const PlayerTimer = () => {
  const socket = useContext(SocketContext);
  const [playerTimer, setPlayerTimer] = useState(0);

  useEffect(() => {
    socket.on("game.timer", (data) => {
      setPlayerTimer(data['playerTimer'])
    });
  }, []);

  return (
    <View style={styles.playerTimerContainer}>
      <Text>Timer: {playerTimer}</Text>
    </View>
  );
};

export default PlayerTimer;
