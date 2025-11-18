import React, { memo } from 'react';
import { TILE_COLORS } from '../constants';

interface TileProps {
  value: number;
}

const Tile: React.FC<TileProps> = ({ value }) => {
  const colorClass = TILE_COLORS[value] || TILE_COLORS["super"];
  
  // Dynamic font sizing for very large numbers
  const fontSize = value > 9999 ? 'text-2xl' : value > 100 ? 'text-4xl' : 'text-5xl';

  if (value === 0) {
    return <div className="w-full h-full rounded bg-[#cdc1b4]"></div>;
  }

  return (
    <div
      className={`w-full h-full rounded flex items-center justify-center font-bold shadow-sm animate-pop ${colorClass} ${value < 128 && value > 0 ? fontSize : ''}`}
    >
      {value}
    </div>
  );
};

export default memo(Tile);