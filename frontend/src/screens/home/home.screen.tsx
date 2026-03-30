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
    screen: null,
    style: "secondary" as const,
  },
  {
    code: "ACTION_04",
    label: "How to Play",
    icon: "book-open" as const,
    screen: null,
    style: "secondary" as const,
  },
];

const MenuContent = ({
  navigation,
  username,
  signOut,
}: {
  navigation: AppNavigationProp;
  username: string;
  signOut: () => void;
}) => (
  <>
    <Text style={styles.titleYam}>YAM</Text>
    <Text style={styles.titleMaster}>MASTER</Text>
    <br />
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
          onPress={() => item.screen && navigation.navigate(item.screen)}
        >
          <View style={styles.menuItemLeft}>
            <Text style={styles.menuItemCode}>{item.code}</Text>
            <Text style={styles.menuItemLabel}>{item.label}</Text>
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

const BottomNav = ({ signOut }: { signOut: () => void }) => (
  <View style={styles.bottomNav}>
    <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
      <Feather name="grid" size={20} color={COLORS.secondary} />
      <Text style={[styles.navLabel, styles.navLabelActive]}>Play</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navItem}>
      <Feather name="bar-chart-2" size={20} color={COLORS.onSurface} />
      <Text style={styles.navLabel}>Rank</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navItem}>
      <Feather name="book-open" size={20} color={COLORS.onSurface} />
      <Text style={styles.navLabel}>Rules</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navItem} onPress={signOut}>
      <Feather name="log-out" size={20} color={COLORS.onSurface} />
      <Text style={styles.navLabel}>Sign out</Text>
    </TouchableOpacity>
  </View>
);

export default function HomeScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const { session, signOut } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const username = session?.user?.name ?? "Master";

  if (isDesktop) {
    return (
      <View style={styles.container}>
        <View style={styles.desktopWrapper}>
          <View style={styles.desktopCard}>
            <ScrollView
              contentContainerStyle={styles.desktopScroll}
              showsVerticalScrollIndicator={false}
            >
              <MenuContent
                navigation={navigation}
                username={username}
                signOut={signOut}
              />
            </ScrollView>
            <BottomNav signOut={signOut} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <MenuContent
          navigation={navigation}
          username={username}
          signOut={signOut}
        />
      </ScrollView>
      <BottomNav signOut={signOut} />
    </View>
  );
}
