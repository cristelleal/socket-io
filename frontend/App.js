import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SocketContext, socket } from './contexts/socket.context';
import HomeScreen from './screens/home.screen';
import OnlineGameScreen from './screens/online-game.screen';
import VsBotGameScreen from './screens/vs-bot-game.screen';

const Stack = createStackNavigator();
LogBox.ignoreAllLogs(true);

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <NavigationContainer>
        <Navigator initialRouteName="HomeScreen">
          <Screen name="HomeScreen" component={HomeScreen} />
          <Screen name="OnlineGameScreen" component={OnlineGameScreen} />
          <Screen name="VsBotGameScreen" component={VsBotGameScreen} />
        </Navigator>
      </NavigationContainer>
    </SocketContext.Provider>
  );
}

export default App;
