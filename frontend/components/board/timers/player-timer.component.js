import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SocketContext } from "../../../contexts/socket.context";

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

const styles = StyleSheet.create({
  playerTimerContainer: {},
});

export default PlayerTimer;
