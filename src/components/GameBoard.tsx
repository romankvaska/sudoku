'use client';

import React, { useMemo, useRef, useCallback } from 'react';
import Cell, { NavigationDirection } from './Cell';

interface GameBoardProps {
  board: number[][];
  puzzle: number[][];
  solution: number[][];
  selectedCell: { row: number; col: number } | null;
  onCellSelect: (row: number, col: number) => void;
  onCellChange: (row: number, col: number, value: number) => void;
}

export default function GameBoard({
  board,
  puzzle,
  solution,
  selectedCell,
  onCellSelect,
  onCellChange,
}: GameBoardProps) {
  // Create refs for all 81 cells
  const cellRefs = useRef<(HTMLInputElement | null)[][]>(
    Array(9).fill(null).map(() => Array(9).fill(null))
  );

  // Calculate related cells (same row, column, and 3x3 box)
  const relatedCells = useMemo(() => {
    if (!selectedCell) return new Set();

    const related = new Set<string>();
    const { row, col } = selectedCell;

    // Add row cells
    for (let c = 0; c < 9; c++) {
      related.add(`${row}-${c}`);
    }

    // Add column cells
    for (let r = 0; r < 9; r++) {
      related.add(`${r}-${col}`);
    }

    // Add 3x3 box cells
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        related.add(`${r}-${c}`);
      }
    }

    return related;
  }, [selectedCell]);

  // Handle navigation between cells
  const handleNavigate = useCallback((fromRow: number, fromCol: number, direction: NavigationDirection) => {
    let newRow = fromRow;
    let newCol = fromCol;

    switch (direction) {
      case 'up':
        newRow = Math.max(0, fromRow - 1);
        break;
      case 'down':
        newRow = Math.min(8, fromRow + 1);
        break;
      case 'left':
        newCol = Math.max(0, fromCol - 1);
        break;
      case 'right':
        newCol = Math.min(8, fromCol + 1);
        break;
    }

    // Select the new cell and focus it
    onCellSelect(newRow, newCol);
    cellRefs.current[newRow][newCol]?.focus();
  }, [onCellSelect]);

  return (
    <div className="flex justify-center">
      <div className="inline-block border-4 border-gray-900 dark:border-gray-100 bg-gray-900 dark:bg-gray-100 gap-0">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-0">
            {row.map((value, colIndex) => {
              const cellKey = `${rowIndex}-${colIndex}`;
              const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
              const isRelated = relatedCells.has(cellKey);
              const isClue = puzzle[rowIndex][colIndex] !== 0;

              return (
                <Cell
                  key={cellKey}
                  ref={(el) => { cellRefs.current[rowIndex][colIndex] = el; }}
                  value={value}
                  isClue={isClue}
                  isSelected={isSelected}
                  isRelated={isRelated && !isSelected}
                  onSelect={() => onCellSelect(rowIndex, colIndex)}
                  onChange={(newValue) => onCellChange(rowIndex, colIndex, newValue)}
                  onNavigate={(direction) => handleNavigate(rowIndex, colIndex, direction)}
                  row={rowIndex}
                  col={colIndex}
                  solution={solution}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
