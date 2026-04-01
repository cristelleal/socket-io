import { useContext, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SocketContext } from '../../shared/contexts/socket.context';
import useSocketEvent from '../../shared/hooks/useSocketEvent';
import { Cell, PlayerOwner } from '../../shared/types/socket.types';
import styles from './grid.styles';

interface GridProps {
  myPlayerKey: PlayerOwner | null;
}

const Grid = ({ myPlayerKey }: GridProps) => {
  const socket = useContext(SocketContext);
  const [displayGrid, setDisplayGrid] = useState(true);
  const [canSelectCells, setCanSelectCells] = useState(false);
  const [canRemoveOpponentCells, setCanRemoveOpponentCells] = useState(false);
  const [grid, setGrid] = useState<Cell[][]>([]);

  useSocketEvent('game.grid.view-state', (data) => {
    setDisplayGrid(data.displayGrid);
    setCanSelectCells(data.canSelectCells);
    setCanRemoveOpponentCells(data.canRemoveOpponentCells);
    setGrid(data.grid);
  });

  const handleCellPress = (cell: Cell, rowIndex: number, cellIndex: number) => {
    if (canRemoveOpponentCells && cell.owner !== null && cell.owner !== myPlayerKey) {
      socket?.emit('game.grid.remove', { rowIndex, cellIndex });
    } else if (canSelectCells && cell.canBeChecked) {
      socket?.emit('game.grid.selected', { cellId: cell.id, rowIndex, cellIndex });
    }
  };

  const isCellPressable = (cell: Cell): boolean => {
    if (canRemoveOpponentCells && cell.owner !== null && cell.owner !== myPlayerKey) return true;
    if (canSelectCells && cell.canBeChecked) return true;
    return false;
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
                  rowIndex !== 0 && styles.topBorder,
                  cellIndex !== 0 && styles.leftBorder,
                ]}
                onPress={() => handleCellPress(cell, rowIndex, cellIndex)}
                disabled={!isCellPressable(cell)}
              >
                <View style={[
                  styles.cellInner,
                  cell.owner === myPlayerKey && styles.playerOwnedCell,
                  cell.owner !== null && cell.owner !== myPlayerKey && styles.opponentOwnedCell,
                  cell.canBeChecked && cell.owner === null && styles.canBeCheckedCell,
                  !cell.owner && !cell.canBeChecked && styles.emptyCell,
                ]}>
                  {cell.viewContent ? (
                    <Text style={styles.cellText}>{cell.viewContent}</Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
    </View>
  );
};

export default Grid;
