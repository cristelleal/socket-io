import { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SocketContext } from "../../shared/contexts/socket.context";
import { useAuth } from "../../shared/contexts/auth.context";
import { AppNavigationProp } from "../../shared/types/navigation.types";
import Board from "../../components/board/board.component";
import BottomNav from "../../components/bottom-nav/bottom-nav.component";
import styles, { COLORS } from "./vs-bot-game.styles";

type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTY_ITEMS: {
  key: Difficulty;
  code: string;
  label: string;
  desc: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  style: "primary" | "secondary";
}[] = [
  {
    key: "easy",
    code: "DIFF_01",
    label: "Easy",
    desc: "The bot plays randomly.",
    icon: "activity",
    style: "primary",
  },
  {
    key: "medium",
    code: "DIFF_02",
    label: "Intermediate",
    desc: "The bot optimises its combos.",
    icon: "zap",
    style: "secondary",
  },
  {
    key: "hard",
    code: "DIFF_03",
    label: "Pro",
    desc: "The bot blocks and strategises.",
    icon: "shield",
    style: "secondary",
  },
];

const DifficultyContent = ({ onSelect }: { onSelect: (d: Difficulty) => void }) => (
  <>
    <Text style={styles.titleVs}>VS</Text>
    <Text style={styles.titleBot}>BOT</Text>
    <Text style={styles.eyebrow}>Solo mode</Text>
    <Text style={styles.tagline}>
      Challenge the AI and put your strategy to the test.
    </Text>

    <View style={styles.shapesRow}>
      <View style={styles.shapeCircle} />
      <View style={styles.shapeRect} />
      <View style={styles.shapeWide} />
    </View>

    <View style={styles.cardList}>
      {DIFFICULTY_ITEMS.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={[
            styles.card,
            item.style === "primary" ? styles.cardPrimary : styles.cardSecondary,
          ]}
          onPress={() => onSelect(item.key)}
          activeOpacity={0.85}
        >
          <View style={styles.cardLeft}>
            <Text style={styles.cardCode}>{item.code}</Text>
            <Text style={styles.cardLabel}>{item.label}</Text>
          </View>
          <Feather name={item.icon} size={22} color={COLORS.onSurface} />
        </TouchableOpacity>
      ))}
    </View>

    <View style={styles.footerLine}>
      <View style={styles.footerDash} />
      <Text style={styles.footerText}>Selected by the Master's Council</Text>
    </View>
  </>
);

export default function VsBotGameScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const socket = useContext(SocketContext);
  const { session } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [inGame, setInGame] = useState(false);
  const [myPlayerKey, setMyPlayerKey] = useState<"player:1" | "player:2" | null>(null);
  const [opponentUsername, setOpponentUsername] = useState("");
  const [playerUsername, setPlayerUsername] = useState("You");
  const [gameResult, setGameResult] = useState<{ won: boolean; reason: string } | null>(null);

  useEffect(() => {
    if (!socket) return;

    const onGameStart = (data: {
      inGame: boolean;
      myPlayerKey: "player:1" | "player:2";
      playerUsername: string;
      opponentUsername: string;
    }) => {
      setInGame(true);
      setMyPlayerKey(data.myPlayerKey);
      setPlayerUsername(data.playerUsername);
      setOpponentUsername(data.opponentUsername);
      setGameResult(null);
    };

    const onGameEnd = (data: { winnerId: string; reason: string }) => {
      setGameResult({ won: data.winnerId === socket.id, reason: data.reason });
      setInGame(false);
    };

    socket.on("game.start", onGameStart);
    socket.on("game.end", onGameEnd);
    return () => {
      socket.off("game.start", onGameStart);
      socket.off("game.end", onGameEnd);
    };
  }, [socket]);

  const startGame = (difficulty: Difficulty) => {
    if (!socket) return;
    socket.emit("bot.game.start", {
      difficulty,
      userId: session?.user?.id,
      username: session?.user?.name ?? undefined,
    });
  };

  const resetScreen = () => {
    setInGame(false);
    setGameResult(null);
    setMyPlayerKey(null);
  };

  if (inGame) {
    return (
      <Board
        playerUsername={playerUsername}
        opponentUsername={opponentUsername}
        myPlayerKey={myPlayerKey}
        gameModeLabel="VS Bot"
        onExitToMenu={() => navigation.navigate("HomeScreen")}
      />
    );
  }

  if (gameResult) {
    const resultContent = (
      <View style={styles.resultCard}>
        <View style={styles.resultIconRow}>
          <Feather
            name={gameResult.won ? "award" : "x-circle"}
            size={40}
            color={gameResult.won ? COLORS.secondary : COLORS.tertiary}
          />
        </View>
        <Text style={styles.resultTitle}>{gameResult.won ? "Victory!" : "Defeat"}</Text>
        <Text style={styles.resultDesc}>
          {gameResult.reason === "ALIGNMENT" && (gameResult.won ? "You aligned 5 pieces." : "The bot aligned 5 pieces.")}
          {gameResult.reason === "PIECES_OUT" && "No pieces left."}
          {gameResult.reason === "DISCONNECT" && "Game over."}
        </Text>
        <TouchableOpacity style={styles.resultPrimaryButton} onPress={resetScreen}>
          <Text style={styles.resultPrimaryButtonText}>Play again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resultSecondaryButton} onPress={() => navigation.navigate("HomeScreen")}>
          <Text style={styles.resultSecondaryButtonText}>Home</Text>
        </TouchableOpacity>
      </View>
    );

    if (isDesktop) {
      return (
        <View style={styles.screen}>
          <View style={styles.desktopWrapper}>
            <View style={styles.desktopCard}>
              <View style={styles.resultContainer}>{resultContent}</View>
            </View>
            <BottomNav activeTab="play" />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.screen}>
        <View style={styles.resultContainer}>{resultContent}</View>
        <BottomNav activeTab="play" />
      </View>
    );
  }

  if (isDesktop) {
    return (
      <View style={styles.screen}>
        <View style={styles.desktopWrapper}>
          <View style={styles.desktopCard}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.desktopScroll} showsVerticalScrollIndicator={false}>
              <DifficultyContent onSelect={startGame} />
            </ScrollView>
          </View>
          <BottomNav activeTab="play" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <DifficultyContent onSelect={startGame} />
      </ScrollView>
      <BottomNav activeTab="play" />
    </View>
  );
}
