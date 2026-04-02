import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../shared/contexts/auth.context';
import { AppNavigationProp } from '../../shared/types/navigation.types';
import styles, { COLORS } from './bottom-nav.styles';

export type ActiveTab = 'play' | 'rank' | 'rules';

interface BottomNavProps {
  activeTab: ActiveTab;
}

export default function BottomNav({ activeTab }: BottomNavProps) {
  const navigation = useNavigation<AppNavigationProp>();
  const { signOut } = useAuth();
  const insets = useSafeAreaInsets();

  const tabs: {
    id: ActiveTab | 'signout';
    icon: React.ComponentProps<typeof Feather>['name'];
    label: string;
    onPress: () => void;
  }[] = [
    { id: 'play',    icon: 'grid',        label: 'Play',     onPress: () => navigation.navigate('HomeScreen') },
    { id: 'rank',    icon: 'bar-chart-2', label: 'Rank',     onPress: () => {} },
    { id: 'rules',   icon: 'book-open',   label: 'Rules',    onPress: () => {} },
    { id: 'signout', icon: 'log-out',     label: 'Sign out', onPress: signOut },
  ];

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom + 12 }]}>
      <View style={styles.bottomNav}>
        {tabs.map(tab => {
          const isActive = tab.id === activeTab;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={tab.onPress}
              activeOpacity={0.75}
            >
              <Feather
                name={tab.icon}
                size={20}
                color={isActive ? COLORS.secondary : COLORS.onSurface}
              />
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
