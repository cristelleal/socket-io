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
  const [playerUsername, setPlayerUsername] = useState('');
  const [opponentUsername, setOpponentUsername] = useState('');

  useEffect(() => {
    if (!socket) return;

    const userId = session?.user?.id;
    const username = session?.user?.name ?? undefined;

    socket.emit('queue.join', { userId, username });
    setInQueue(false);
    setInGame(false);

    const onQueueAdded = (data: { inQueue: boolean; inGame: boolean }) => {
      setInQueue(data.inQueue);
      setInGame(data.inGame);
    };

    const onGameStart = (data: {
      inQueue: boolean;
      inGame: boolean;
      playerUsername: string;
      opponentUsername: string;
    }) => {
      setInQueue(data.inQueue);
      setInGame(data.inGame);
      setPlayerUsername(data.playerUsername);
      setOpponentUsername(data.opponentUsername);
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
        <View style={styles.stateCard}>
          <Text style={styles.paragraph}>Connexion au serveur...</Text>
        </View>
      )}

      {inQueue && (
        <View style={styles.stateCard}>
          <Text style={styles.paragraph}>En attente d'un adversaire...</Text>
          <Text style={styles.footnote}>Vous serez connecté automatiquement.</Text>
        </View>
      )}

      {inGame && (
        <Board
          playerUsername={playerUsername}
          opponentUsername={opponentUsername}
        />
      )}
    </View>
  );
};

export default OnlineGameController;
