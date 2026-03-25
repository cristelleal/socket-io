import { LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SocketContext, socket } from "./src/shared/contexts/socket.context";
import HomeScreen from "./src/screens/home/home.screen";
import OnlineGameScreen from "./src/screens/online-game/online-game.screen";
import VsBotGameScreen from "./src/screens/vs-bot-game/vs-bot-game.screen";
import "./src/shared/types/navigation.types";
import styles, { headerTintColor } from "./app.styles";

const Stack = createStackNavigator();
LogBox.ignoreAllLogs(true);

export default function App() {
  return (
    <SocketContext.Provider value={socket}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="HomeScreen"
          screenOptions={{
            headerStyle: styles.header,
            headerTintColor,
            headerTitleStyle: styles.headerTitle,
            cardStyle: styles.card,
          }}
        >
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ title: "Pastel Yatzy" }}
          />
          <Stack.Screen
            name="OnlineGameScreen"
            component={OnlineGameScreen}
            options={{ title: "Partie en ligne" }}
          />
          <Stack.Screen
            name="VsBotGameScreen"
            component={VsBotGameScreen}
            options={{ title: "Partie contre le bot" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SocketContext.Provider>
  );
}
