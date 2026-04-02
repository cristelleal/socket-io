import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  AuthScreen: undefined;
  HomeScreen: undefined;
  OnlineGameScreen: undefined;
  VsBotGameScreen: undefined;
  RulesScreen: undefined;
  RankScreen: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type AppNavigationProp = StackNavigationProp<RootStackParamList>;
