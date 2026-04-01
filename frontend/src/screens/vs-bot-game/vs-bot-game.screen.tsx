import { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SocketContext } from "../../shared/contexts/socket.context";
import { useAuth } from "../../shared/contexts/auth.context";
import { AppNavigationProp } from "../../shared/types/navigation.types";
import Board from "../../components/board/board.component";
import styles from "./vs-bot-game.styles";

type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTY_DATA: {
  key: Difficulty;
  code: string;
  label: string;
  desc: string;
  emoji: string;
  badgeStyle: object;
}[] = [
  {
    key: "easy",
    code: "01",
    label: "Facile",
    desc: "Le bot joue au hasard.",
    emoji: "🌱",
    badgeStyle: styles.cardBadgeEasy,
  },
  {
    key: "medium",
    code: "02",
    label: "Intermédiaire",
    desc: "Le bot optimise ses combos.",
    emoji: "⚡",
    badgeStyle: styles.cardBadgeMedium,
  },
  {
    key: "hard",
    code: "03",
    label: "Pro",
    desc: "Le bot bloque et stratégise.",
    emoji: "💀",
    badgeStyle: styles.cardBadgeHard,
  },
];

export default function VsBotGameScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const socket = useContext(SocketContext);
  const { session } = useAuth();

  const [inGame, setInGame] = useState(false);
  const [myPlayerKey, setMyPlayerKey] = useState<
    "player:1" | "player:2" | null
  >(null);
  const [opponentUsername, setOpponentUsername] = useState("");
  const [playerUsername, setPlayerUsername] = useState("Vous");
  const [gameResult, setGameResult] = useState<{
    won: boolean;
    reason: string;
  } | null>(null);

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
      const won = data.winnerId === socket.id;
      setGameResult({ won, reason: data.reason });
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
    const username = session?.user?.name ?? undefined;
    socket?.emit("bot.game.start", { difficulty, username });
  };

  const resetScreen = () => {
    setInGame(false);
    setGameResult(null);
    setMyPlayerKey(null);
  };

  if (gameResult) {
    return (
      <View style={styles.resultContainer}>
        <View style={styles.resultCard}>
          <Text style={styles.resultEmoji}>{gameResult.won ? "🏆" : "😤"}</Text>
          <Text style={styles.resultTitle}>
            {gameResult.won ? "Victoire !" : "Défaite"}
          </Text>
          <Text style={styles.resultDesc}>
            {gameResult.reason === "ALIGNMENT" &&
              (gameResult.won
                ? "Tu as aligné 5 pions."
                : "Le bot a aligné 5 pions.")}
            {gameResult.reason === "PIECES_OUT" && "Plus de pions disponibles."}
            {gameResult.reason === "DISCONNECT" && "Partie terminée."}
          </Text>

          <TouchableOpacity
            style={styles.resultPrimaryButton}
            onPress={resetScreen}
          >
            <Text style={styles.resultPrimaryButtonText}>Rejouer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.resultSecondaryButton}
            onPress={() => navigation.navigate("HomeScreen")}
          >
            <Text style={styles.resultSecondaryButtonText}>Accueil</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (inGame) {
    return (
      <Board
        playerUsername={playerUsername}
        opponentUsername={opponentUsername}
        myPlayerKey={myPlayerKey}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>Mode solo</Text>
        <Text style={styles.title}>
          {"Jouer\n"}
          <Text style={styles.titleAccent}>vs Bot</Text>
        </Text>
        <Text style={styles.tagline}>
          Affronte l'intelligence artificielle et teste ta stratégie.
        </Text>
        <View style={styles.shapesRow}>
          <View style={styles.shapeCircle} />
          <View style={styles.shapeRect} />
          <View style={styles.shapeWide} />
        </View>
        <View style={styles.cardList}>
          {DIFFICULTY_DATA.map((d, i) => (
            <TouchableOpacity
              key={d.key}
              style={[
                styles.card,
                i === 0 ? styles.cardPrimary : styles.cardSecondary,
              ]}
              onPress={() => socket && startGame(d.key)}
              activeOpacity={0.75}
            >
              <View style={styles.cardLeft}>
                <Text style={styles.cardCode}>{d.code}</Text>
                <Text style={styles.cardLabel}>{d.label}</Text>
                <Text style={styles.cardDesc}>{d.desc}</Text>
              </View>
              <View style={[styles.cardBadge, d.badgeStyle]}>
                <Text style={styles.cardBadgeText}>{d.emoji}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.footerLine}>
          <View style={styles.footerDash} />
          <Text style={styles.footerText}>Yam Master</Text>
          <View style={styles.footerDash} />
        </View>
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("HomeScreen")}
          activeOpacity={0.75}
        >
          <Text style={styles.backButtonText}>← Retour au menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
