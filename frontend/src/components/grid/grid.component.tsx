import { useContext, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SocketContext } from '../../shared/contexts/socket.context';
import useSocketEvent from '../../shared/hooks/useSocketEvent';
import { Cell } from '../../shared/types/socket.types';
import styles from './grid.styles';

const Grid = () => {
  const socket = useContext(SocketContext);
  const [displayGrid, setDisplayGrid] = useState(true);
  const [canSelectCells, setCanSelectCells] = useState(false);
  const [grid, setGrid] = useState<Cell[][]>([]);

  useSocketEvent('game.grid.view-state', (data) => {
    setDisplayGrid(data.displayGrid);
    setCanSelectCells(data.canSelectCells);
    setGrid(data.grid);
  });

  const handleSelectCell = (cellId: string, rowIndex: number, cellIndex: number) => {
    if (canSelectCells) {
      socket?.emit('game.grid.selected', { cellId, rowIndex, cellIndex });
    }
  };

  return (
    <View style={styles.gridContainer}>
      {displayGrid &&
        grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, cellIndex) => (
              <TouchableOpacity
                key={cell.id + String(rowIndex) + String(cellIndex)}
                style={[
                  styles.cell,
                  cell.owner === 'player:1' && styles.playerOwnedCell,
                  cell.owner === 'player:2' && styles.opponentOwnedCell,
                  cell.canBeChecked && cell.owner === null && styles.canBeCheckedCell,
                  rowIndex !== 0 && styles.topBorder,
                  cellIndex !== 0 && styles.leftBorder,
                ]}
                onPress={() => handleSelectCell(cell.id, rowIndex, cellIndex)}
                disabled={!cell.canBeChecked}
              >
                <Text style={styles.cellText}>{cell.viewContent}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
    </View>
  );
};

export default Grid;
