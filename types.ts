export type Grid = number[][];

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export interface GameState {
  grid: Grid;
  score: number;
  bestScore: number;
  gameOver: boolean;
  won: boolean;
  previousGrid: Grid | null; // For simple undo or move comparison
}

export interface TileProps {
  value: number;
  isNew?: boolean;
  isMerged?: boolean;
}
