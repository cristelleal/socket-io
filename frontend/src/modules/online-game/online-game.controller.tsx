import { useEffect, useState, useContext } from 'react';
import { Text, View } from 'react-native';
import { SocketContext } from '../../shared/contexts/socket.context';
import { useAuth } from '../../shared/contexts/auth.context';
import Board from '../../components/board/board.component';
import styles from './online-game.controller.styles';

const OnlineGameController = () => {
  const socket = useContext(SocketContext);
  const { session } = useAuth();

  const [inQueue, setInQueue] = useState(false);
  const [inGame, setInGame] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const userId = session?.user?.id;
    console.log('[emit][queue.join]:', socket.id, '(userId:', userId ?? 'anonymous', ')');
    socket.emit('queue.join', { userId });
    setInQueue(false);
    setInGame(false);

    const onQueueAdded = (data: { inQueue: boolean; inGame: boolean }) => {
      console.log('[listen][queue.added]:', data);
      setInQueue(data.inQueue);
      setInGame(data.inGame);
    };

    const onGameStart = (data: { inQueue: boolean; inGame: boolean; idOpponent: string }) => {
      console.log('[listen][game.start]:', data);
      setInQueue(data.inQueue);
      setInGame(data.inGame);
    };

    socket.on('queue.added', onQueueAdded);
    socket.on('game.start', onGameStart);

    return () => {
      socket.off('queue.added', onQueueAdded);
      socket.off('game.start', onGameStart);
    };
  }, []);

  return (
    <View style={styles.container}>
      {!inQueue && !inGame && (
        <Text style={styles.paragraph}>Waiting for server datas...</Text>
      )}

      {inQueue && (
        <Text style={styles.paragraph}>Waiting for another player...</Text>
      )}

      {inGame && <Board />}
    </View>
  );
};

export default OnlineGameController;
