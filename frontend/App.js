import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SocketContext, socket } from './contexts/socket.context';
import HomeScreen from './screens/home/home.screen';
import OnlineGameScreen from './screens/online-game/online-game.screen';
import VsBotGameScreen from './screens/vs-bot-game/vs-bot-game.screen';

const Stack = createStackNavigator();
LogBox.ignoreAllLogs(true);

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="HomeScreen"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f4ebde',
            },
            headerTintColor: '#304255',
            headerTitleStyle: {
              fontWeight: '700',
              letterSpacing: 0.4,
            },
            cardStyle: {
              backgroundColor: '#fffaf2',
            },
          }}
        >
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ title: 'Pastel Yatzy' }}
          />
          <Stack.Screen
            name="OnlineGameScreen"
            component={OnlineGameScreen}
            options={{ title: 'Partie en ligne' }}
          />
          <Stack.Screen
            name="VsBotGameScreen"
            component={VsBotGameScreen}
            options={{ title: 'Partie contre le bot' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SocketContext.Provider>
  );
}

export default App;
