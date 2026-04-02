import { useEffect, useState, useContext } from "react";
import { Text, View, TouchableOpacity, useWindowDimensions, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SocketContext } from "../../shared/contexts/socket.context";
import { useAuth } from "../../shared/contexts/auth.context";
import Board from "../../components/board/board.component";
import BottomNav from "../../components/bottom-nav/bottom-nav.component";
import styles, { COLORS } from "./online-game.controller.styles";

const OnlineGameController = () => {
  const socket = useContext(SocketContext);
  const { session } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

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

  if (inGame) {
    return (
      <Board
        playerUsername={playerUsername}
        opponentUsername={opponentUsername}
        myPlayerKey={myPlayerKey}
      />
    );
  }

  const cardContent = gameResult ? (
    <View style={styles.resultCard}>
      <View style={styles.resultIconRow}>
        <Feather
          name={gameResult.won ? "award" : "x-circle"}
          size={40}
          color={gameResult.won ? COLORS.secondary : COLORS.tertiary}
        />
      </View>
      <Text style={styles.resultTitle}>
        {gameResult.won ? "Victory!" : "Defeat"}
      </Text>
      <Text style={styles.resultDesc}>
        {gameResult.reason === "ALIGNMENT" &&
          (gameResult.won ? "You aligned 5 pieces." : "Opponent aligned 5 pieces.")}
        {gameResult.reason === "PIECES_OUT" && "No pieces left."}
        {gameResult.reason === "DISCONNECT" && "Opponent disconnected."}
      </Text>
      <TouchableOpacity style={styles.primaryButton} onPress={handlePlayAgain}>
        <Text style={styles.primaryButtonText}>Play again</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View style={styles.stateCard}>
      {!inQueue && (
        <>
          <Feather name="wifi" size={28} color={COLORS.onSurfaceSubtle} />
          <Text style={styles.paragraph}>Connecting...</Text>
        </>
      )}
      {inQueue && (
        <>
          <Feather name="users" size={28} color={COLORS.onSurfaceSubtle} />
          <Text style={styles.paragraph}>Waiting for an opponent...</Text>
          <Text style={styles.footnote}>You will be matched automatically.</Text>
        </>
      )}
    </View>
  );

  if (isDesktop) {
    return (
      <View style={styles.screen}>
        <View style={styles.desktopWrapper}>
          <View style={styles.desktopCard}>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.desktopScroll}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.eyebrow}>Online</Text>
              <Text style={styles.title}>
                {"Play\n"}
                <Text style={styles.titleAccent}>Online</Text>
              </Text>
              <View style={styles.shapesRow}>
                <View style={styles.shapeCircle} />
                <View style={styles.shapeRect} />
                <View style={styles.shapeWide} />
              </View>
              {cardContent}
            </ScrollView>
            <BottomNav activeTab="play" />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.centeredContent}>
        {cardContent}
      </View>
      <BottomNav activeTab="play" />
    </View>
  );
};

export default OnlineGameController;
