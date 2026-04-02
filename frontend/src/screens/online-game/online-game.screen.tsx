import { useContext } from 'react';
import { SocketContext } from '../../shared/contexts/socket.context';
import OnlineGameController from '../../modules/online-game/online-game.controller';
import NoConnectionScreen from './no-connection.screen';

export default function OnlineGameScreen() {
  const socket = useContext(SocketContext);

  if (!socket) return <NoConnectionScreen />;

  return <OnlineGameController />;
}
