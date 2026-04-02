import { LogBox } from 'react-native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SocketContext, socket } from './src/shared/contexts/socket.context';
import { AuthProvider, useAuth } from './src/shared/contexts/auth.context';
import { AuthScreen } from './src/screens/auth/auth.screen';
import HomeScreen from './src/screens/home/home.screen';
import OnlineGameScreen from './src/screens/online-game/online-game.screen';
import VsBotGameScreen from './src/screens/vs-bot-game/vs-bot-game.screen';
import RulesScreen from './src/screens/rules/rules.screen';
import './src/shared/types/navigation.types';
import styles from './app.styles';

const Stack = createStackNavigator();
LogBox.ignoreAllLogs(true);

const AppNavigator = () => {
  const { session, isPending } = useAuth();

  if (isPending) return null;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        cardStyle: styles.card,
      }}
    >
      {session ? (
        <>
          <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OnlineGameScreen" component={OnlineGameScreen} options={{ headerShown: false }} />
          <Stack.Screen name="VsBotGameScreen" component={VsBotGameScreen} options={{ headerShown: false }} />
          <Stack.Screen name="RulesScreen" component={RulesScreen} options={{ headerShown: false }} />
        </>
      ) : (
        <Stack.Screen name="AuthScreen" component={AuthScreen} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SocketContext.Provider value={socket}>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </SocketContext.Provider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
