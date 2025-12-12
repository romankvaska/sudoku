'use client';

import { forwardRef, useState, useEffect } from 'react';

export type NavigationDirection = 'up' | 'down' | 'left' | 'right';

interface CellProps {
  value: number;
  isClue: boolean;
  isSelected: boolean;
  isRelated: boolean;
  onSelect: () => void;
  onChange: (value: number) => void;
  onNavigate: (direction: NavigationDirection) => void;
  row: number;
  col: number;
  solution: number[][];
}

const Cell = forwardRef<HTMLInputElement, CellProps>(function Cell({
  value,
  isClue,
  isSelected,
  isRelated,
  onSelect,
  onChange,
  onNavigate,
  row,
  col,
  solution,
}, ref) {
  // Local state for the input value (not yet committed)
  const [localValue, setLocalValue] = useState<number>(value);
  const [hasLocalChange, setHasLocalChange] = useState(false);

  // Sync local value when prop value changes (e.g., from hints or external updates)
  useEffect(() => {
    if (!hasLocalChange) {
      setLocalValue(value);
    }
  }, [value, hasLocalChange]);

  // Commit the local value to the store (triggers validation)
  const commitValue = () => {
    if (hasLocalChange && localValue !== value) {
      onChange(localValue);
    }
    setHasLocalChange(false);
  };

  const isIncorrect = value !== 0 && !isClue && solution[row][col] !== value;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle arrow key navigation - commit before navigating
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      commitValue();
      onNavigate('up');
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      commitValue();
      onNavigate('down');
      return;
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      commitValue();
      onNavigate('left');
      return;
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      commitValue();
      onNavigate('right');
      return;
    }

    // Handle Enter key - commit value
    if (e.key === 'Enter') {
      e.preventDefault();
      commitValue();
      return;
    }

    // Handle number input - update local state only
    const num = parseInt(e.key);

    if (e.key === 'Backspace' || e.key === 'Delete') {
      setLocalValue(0);
      setHasLocalChange(true);
      return;
    }

    if (!isNaN(num) && num >= 1 && num <= 9 && !isClue) {
      setLocalValue(num);
      setHasLocalChange(true);
      e.preventDefault();
    }
  };

  const handleClick = () => {
    if (!isClue) {
      onSelect();
    }
  };

  const handleBlur = () => {
    commitValue();
  };

  const borderClasses = `
    ${col === 2 || col === 5 ? 'border-r-2 border-gray-900 dark:border-gray-100' : 'border-r border-gray-400 dark:border-gray-600'}
    ${row === 2 || row === 5 ? 'border-b-2 border-gray-900 dark:border-gray-100' : 'border-b border-gray-400 dark:border-gray-600'}
  `;

  return (
    <div
      className={`
        w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16
        flex items-center justify-center cursor-pointer
        transition-colors duration-200
        ${borderClasses}
        ${isSelected
          ? 'bg-blue-500 dark:bg-blue-600'
          : isIncorrect
            ? 'bg-red-200 dark:bg-red-900'
            : isRelated
              ? 'bg-blue-100 dark:bg-blue-900'
              : 'bg-white dark:bg-gray-800'
        }
        ${isClue ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}
      `}
      onClick={handleClick}
    >
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        value={localValue === 0 ? '' : localValue}
        onChange={(e) => {
          const val = e.target.value;
          if (val === '') {
            setLocalValue(0);
            setHasLocalChange(true);
          } else if (!isNaN(parseInt(val)) && parseInt(val) >= 1 && parseInt(val) <= 9) {
            setLocalValue(parseInt(val));
            setHasLocalChange(true);
          }
        }}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        readOnly={isClue}
        className={`
          w-full h-full text-center font-bold
          text-lg sm:text-xl md:text-2xl
          bg-transparent border-none outline-none
          ${isSelected
            ? 'text-white dark:text-white'
            : isIncorrect
              ? 'text-red-700 dark:text-red-300'
              : isClue
                ? 'text-gray-900 dark:text-white'
                : 'text-blue-600 dark:text-blue-400'
          }
          ${isClue ? 'cursor-not-allowed' : ''}
        `}
        maxLength={1}
      />
    </div>
  );
});

export default Cell;
