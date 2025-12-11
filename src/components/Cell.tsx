'use client';

interface CellProps {
  value: number;
  isClue: boolean;
  isSelected: boolean;
  isRelated: boolean;
  onSelect: () => void;
  onChange: (value: number) => void;
  row: number;
  col: number;
  solution: number[][];
}

export default function Cell({
  value,
  isClue,
  isSelected,
  isRelated,
  onSelect,
  onChange,
  row,
  col,
  solution,
}: CellProps) {
  const isIncorrect = value !== 0 && !isClue && solution[row][col] !== value;
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const num = parseInt(e.key);

    if (e.key === 'Backspace' || e.key === 'Delete') {
      onChange(0);
      return;
    }

    if (!isNaN(num) && num >= 1 && num <= 9 && !isClue) {
      onChange(num);
      e.preventDefault();
    }

    if (e.key === 'ArrowUp' && row > 0) {
      e.preventDefault();
      // Handle arrow navigation (should be handled by parent)
    }
  };

  const handleClick = () => {
    if (!isClue) {
      onSelect();
    }
  };

  const borderClasses = `
    ${col === 2 || col === 5 ? 'border-r-2 border-gray-900 dark:border-gray-100' : 'border-r border-gray-400 dark:border-gray-600'}
    ${row === 2 || row === 5 ? 'border-b-2 border-gray-900 dark:border-gray-100' : 'border-b border-gray-400 dark:border-gray-600'}
  `;

  return (
    <div
      className={`
        w-16 h-16 flex items-center justify-center cursor-pointer
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
        type="text"
        inputMode="numeric"
        value={value === 0 ? '' : value}
        onChange={(e) => {
          const val = e.target.value;
          if (val === '') {
            onChange(0);
          } else if (!isNaN(parseInt(val)) && parseInt(val) >= 1 && parseInt(val) <= 9) {
            onChange(parseInt(val));
          }
        }}
        onKeyDown={handleKeyDown}
        readOnly={isClue}
        className={`
          w-full h-full text-center font-bold text-2xl
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
}
