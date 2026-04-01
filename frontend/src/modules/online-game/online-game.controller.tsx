import { useEffect, useState, useContext } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { SocketContext } from "../../shared/contexts/socket.context";
import { useAuth } from "../../shared/contexts/auth.context";
import Board from "../../components/board/board.component";
import styles from "./online-game.controller.styles";

const OnlineGameController = () => {
  const socket = useContext(SocketContext);
  const { session } = useAuth();

  const [inQueue, setInQueue] = useState(false);
  const [inGame, setInGame] = useState(false);
  const [playerUsername, setPlayerUsername] = useState("");
  const [opponentUsername, setOpponentUsername] = useState("");
  const [myPlayerKey, setMyPlayerKey] = useState<
    "player:1" | "player:2" | null
  >(null);
  const [gameResult, setGameResult] = useState<{
    won: boolean;
    reason: string;
  } | null>(null);

  useEffect(() => {
    if (!socket) return;

    const userId = session?.user?.id;
    const username = session?.user?.name ?? undefined;

    socket.emit("queue.join", { userId, username });
    setInQueue(false);
    setInGame(false);
    setGameResult(null);

    const onQueueAdded = (data: { inQueue: boolean; inGame: boolean }) => {
      setInQueue(data.inQueue);
      setInGame(data.inGame);
    };

    const onGameStart = (data: {
      inQueue: boolean;
      inGame: boolean;
      myPlayerKey: "player:1" | "player:2";
      playerUsername: string;
      opponentUsername: string;
    }) => {
      setInQueue(data.inQueue);
      setInGame(data.inGame);
      setMyPlayerKey(data.myPlayerKey);
      setPlayerUsername(data.playerUsername);
      setOpponentUsername(data.opponentUsername);
      setGameResult(null);
    };

    const onGameEnd = (data: { winnerId: string; reason: string }) => {
      const won = data.winnerId === socket.id;
      setGameResult({ won, reason: data.reason });
      setInGame(false);
    };

    socket.on("queue.added", onQueueAdded);
    socket.on("game.start", onGameStart);
    socket.on("game.end", onGameEnd);

    return () => {
      socket.off("queue.added", onQueueAdded);
      socket.off("game.start", onGameStart);
      socket.off("game.end", onGameEnd);
    };
  }, []);

  const handlePlayAgain = () => {
    setGameResult(null);
    setInQueue(false);
    setInGame(false);
    if (socket) {
      const userId = session?.user?.id;
      const username = session?.user?.name ?? undefined;
      socket.emit("queue.join", { userId, username });
    }
  };

  if (gameResult) {
    return (
      <View style={styles.container}>
        <View style={styles.stateCard}>
          <Text style={styles.paragraph}>
            {gameResult.won ? "Victoire !" : "Défaite"}
          </Text>
          <Text style={styles.footnote}>
            {gameResult.reason === "ALIGNMENT" &&
              (gameResult.won
                ? "Alignement de 5 !"
                : "L'adversaire a aligné 5 pions.")}
            {gameResult.reason === "PIECES_OUT" && "Plus de pions disponibles."}
            {gameResult.reason === "DISCONNECT" &&
              "L'adversaire s'est déconnecté."}
          </Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handlePlayAgain}
          >
            <Text style={styles.actionButtonText}>Rejouer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!inQueue && !inGame && (
        <View style={styles.stateCard}>
          <Text style={styles.paragraph}>Connexion au serveur...</Text>
        </View>
      )}

      {inQueue && (
        <View style={styles.stateCard}>
          <Text style={styles.paragraph}>En attente d'un adversaire...</Text>
          <Text style={styles.footnote}>
            Vous serez connecté automatiquement.
          </Text>
        </View>
      )}

      {inGame && (
        <Board
          playerUsername={playerUsername}
          opponentUsername={opponentUsername}
          myPlayerKey={myPlayerKey}
        />
      )}
    </View>
  );
};

export default OnlineGameController;
