import React from 'react';
import Tile from './Tile';
import { Grid } from '../types';

interface BoardProps {
  grid: Grid;
}

const Board: React.FC<BoardProps> = ({ grid }) => {
  return (
    <div className="relative p-4 bg-[#bbada0] rounded-lg shadow-xl w-full max-w-[500px] aspect-square">
      <div className="grid grid-cols-4 grid-rows-4 gap-3 w-full h-full">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} className="relative w-full h-full">
               <Tile value={cell} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Board;
