import { useEffect, useState, useContext } from "react";
import { Text, View } from "react-native";
import { SocketContext } from '../contexts/socket.context';
import Board from '../components/board/board.component';
import styles from './online-game.styles';

export default function OnlineGameController() {

    const socket = useContext(SocketContext);

    const [inQueue, setInQueue] = useState(false);
    const [inGame, setInGame] = useState(false);
    const [_idOpponent, setIdOpponent] = useState(null);

    useEffect(() => {
        console.log('[emit][queue.join]:', socket.id);
        socket.emit("queue.join");
        setInQueue(false);
        setInGame(false);

        const onQueueAdded = (data) => {
            console.log('[listen][queue.added]:', data);
            setInQueue(data['inQueue']);
            setInGame(data['inGame']);
        };

        const onGameStart = (data) => {
            console.log('[listen][game.start]:', data);
            setInQueue(data['inQueue']);
            setInGame(data['inGame']);
            setIdOpponent(data['idOpponent']);
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
                <>
                    <Text style={styles.paragraph}>
                        Waiting for server datas...
                    </Text>
                </>
            )}

            {inQueue && (
                <>
                    <Text style={styles.paragraph}>
                        Waiting for another player...
                    </Text>
                </>
            )}

            {inGame && (
                <Board />
            )}
        </View>
    );
}

