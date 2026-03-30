import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SocketContext, socket } from './src/shared/contexts/socket.context';
import { AuthProvider, useAuth } from './src/shared/contexts/auth.context';
import { AuthScreen } from './src/screens/auth/auth.screen';
import HomeScreen from './src/screens/home/home.screen';
import OnlineGameScreen from './src/screens/online-game/online-game.screen';
import VsBotGameScreen from './src/screens/vs-bot-game/vs-bot-game.screen';
import './src/shared/types/navigation.types';
import styles, { headerTintColor } from './app.styles';

const Stack = createStackNavigator();
LogBox.ignoreAllLogs(true);

const AppNavigator = () => {
  const { session, isPending } = useAuth();

  if (isPending) return null;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: styles.header,
        headerTintColor,
        headerTitleStyle: styles.headerTitle,
        cardStyle: styles.card,
      }}
    >
      {session ? (
        <>
          <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Yam Master' }} />
          <Stack.Screen name="OnlineGameScreen" component={OnlineGameScreen} options={{ title: 'Online Game' }} />
          <Stack.Screen name="VsBotGameScreen" component={VsBotGameScreen} options={{ title: 'Vs Bot' }} />
        </>
      ) : (
        <Stack.Screen name="AuthScreen" component={AuthScreen} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SocketContext.Provider value={socket}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SocketContext.Provider>
    </AuthProvider>
  );
}
