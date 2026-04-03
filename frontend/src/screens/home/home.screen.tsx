import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppNavigationProp } from "../../shared/types/navigation.types";
import { useAuth } from "../../shared/contexts/auth.context";
import BottomNav from "../../components/bottom-nav/bottom-nav.component";
import styles, { COLORS } from "./home.styles";

const MENU_ITEMS = [
  {
    code: "ACTION_01",
    label: "Start New Game",
    icon: "play" as const,
    screen: "OnlineGameScreen" as const,
    style: "primary" as const,
  },
  {
    code: "ACTION_02",
    label: "Vs Bot",
    icon: "cpu" as const,
    screen: "VsBotGameScreen" as const,
    style: "secondary" as const,
  },
  {
    code: "ACTION_03",
    label: "Hall of Fame",
    icon: "award" as const,
    screen: "RankScreen" as const,
    style: "secondary" as const,
  },
  {
    code: "ACTION_04",
    label: "How to Play",
    icon: "book-open" as const,
    screen: "RulesScreen" as const,
    style: "secondary" as const,
  },
];

const MenuContent = ({
  navigation,
  username,
}: {
  navigation: AppNavigationProp;
  username: string;
}) => (
  <>
    <Text style={styles.titleYam}>YAM</Text>
    <Text style={styles.titleMaster}>MASTER</Text>
    <View style={{ height: 8 }} />
    <Text style={styles.eyebrow}>Player {username}</Text>
    <Text style={styles.tagline}>
      A tactile journey into high-stakes strategy. Every move is a curated
      strike of genius.
    </Text>

    <View style={styles.shapesRow}>
      <View style={styles.shapeCircle} />
      <View style={styles.shapeRect} />
      <View style={styles.shapeWide} />
    </View>

    <View style={styles.menuList}>
      {MENU_ITEMS.map((item) => (
        <TouchableOpacity
          key={item.code}
          style={[
            styles.menuItem,
            item.style === "primary"
              ? styles.menuItemPrimary
              : styles.menuItemSecondary,
          ]}
          activeOpacity={0.85}
          onPress={() => {
            if (item.screen === "OnlineGameScreen") navigation.navigate("OnlineGameScreen");
            if (item.screen === "VsBotGameScreen") navigation.navigate("VsBotGameScreen");
            if (item.screen === "RulesScreen") navigation.navigate("RulesScreen");
            if (item.screen === "RankScreen") navigation.navigate("RankScreen");
          }}
        >
          <View style={styles.menuItemLeft}>
            <Text style={styles.menuItemCode}>{item.code}</Text>
            <Text style={styles.menuItemLabel}>{item.label}</Text>
          </View>
          <Feather name={item.icon} size={22} color={COLORS.onSurface} />
        </TouchableOpacity>
      ))}
    </View>
  </>
);


export default function HomeScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const { session } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const username = session?.user?.name ?? "Master";

  if (isDesktop) {
    return (
      <View style={styles.container}>
        <View style={styles.desktopWrapper}>
          <View style={styles.desktopCard}>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.desktopScroll}
              showsVerticalScrollIndicator={false}
            >
              <MenuContent
                navigation={navigation}
                username={username}
              />
            </ScrollView>
          </View>
          <BottomNav activeTab="play" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <MenuContent
          navigation={navigation}
          username={username}
        />
      </ScrollView>
      <BottomNav activeTab="play" />
    </View>
  );
}
