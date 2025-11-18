import { GRID_SIZE } from '../constants';
import { Grid, Direction } from '../types';

export const getEmptyGrid = (): Grid => {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
};

export const getRandomCoordinates = (grid: Grid): { x: number; y: number } | null => {
  const emptyCoordinates: { x: number; y: number }[] = [];
  grid.forEach((row, rIndex) => {
    row.forEach((cell, cIndex) => {
      if (cell === 0) {
        emptyCoordinates.push({ x: rIndex, y: cIndex });
      }
    });
  });

  if (emptyCoordinates.length === 0) return null;
  return emptyCoordinates[Math.floor(Math.random() * emptyCoordinates.length)];
};

export const addRandomTile = (grid: Grid): Grid => {
  const newGrid = grid.map((row) => [...row]);
  const coords = getRandomCoordinates(newGrid);
  if (coords) {
    newGrid[coords.x][coords.y] = Math.random() < 0.9 ? 2 : 4;
  }
  return newGrid;
};

// Check if two grids are identical
export const gridsEqual = (g1: Grid, g2: Grid): boolean => {
  return JSON.stringify(g1) === JSON.stringify(g2);
};

export const checkGameOver = (grid: Grid): boolean => {
  // Check for empty cells
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === 0) return false;
    }
  }

  // Check for possible merges
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const current = grid[i][j];
      // Check right
      if (j < GRID_SIZE - 1 && grid[i][j + 1] === current) return false;
      // Check down
      if (i < GRID_SIZE - 1 && grid[i + 1][j] === current) return false;
    }
  }

  return true;
};

// --- Movement Logic ---

const slideRowLeft = (row: number[]): { newRow: number[]; score: number } => {
  const nonZero = row.filter((val) => val !== 0);
  const merged: number[] = [];
  let score = 0;

  for (let i = 0; i < nonZero.length; i++) {
    if (i < nonZero.length - 1 && nonZero[i] === nonZero[i + 1]) {
      const sum = nonZero[i] * 2;
      merged.push(sum);
      score += sum;
      i++; // Skip next tile as it's merged
    } else {
      merged.push(nonZero[i]);
    }
  }

  // Pad with zeros
  while (merged.length < GRID_SIZE) {
    merged.push(0);
  }

  return { newRow: merged, score };
};

const rotateLeft = (grid: Grid): Grid => {
  const newGrid = getEmptyGrid();
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      newGrid[i][j] = grid[j][GRID_SIZE - 1 - i];
    }
  }
  return newGrid;
};

const rotateRight = (grid: Grid): Grid => {
  const newGrid = getEmptyGrid();
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      newGrid[i][j] = grid[GRID_SIZE - 1 - j][i];
    }
  }
  return newGrid;
};

export const moveGrid = (grid: Grid, direction: Direction): { grid: Grid; score: number; moved: boolean } => {
  let currentGrid = grid.map((row) => [...row]);
  let scoreToAdd = 0;

  // Normalize to "Left" movement by rotating
  if (direction === Direction.RIGHT) {
    currentGrid = currentGrid.map((row) => row.reverse());
  } else if (direction === Direction.UP) {
    currentGrid = rotateLeft(currentGrid);
  } else if (direction === Direction.DOWN) {
    currentGrid = rotateRight(currentGrid); // Rotates 90deg right, so down becomes left
    // Wait, standard rotation logic:
    // If we want to move DOWN, we can rotate the board 90 degrees CLOCKWISE (Right).
    // Then the "Down" direction is pointing "Left".
    // Then we process Left.
    // Then we rotate 90 degrees COUNTER-CLOCKWISE (Left) to restore.
    // Let's verify:
    // [1, 0]  Rotate Right -> [0, 1] (Rows become cols inverted).
    // [0, 0]                  [0, 0]
    // Move Left -> [1, 0]
    //              [0, 0]
    // Rotate Left -> [0, 0]
    //                [1, 0]
    // Correct.
  }

  // Process Left Move
  let processedGrid: Grid = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    const { newRow, score } = slideRowLeft(currentGrid[i]);
    processedGrid.push(newRow);
    scoreToAdd += score;
  }
  currentGrid = processedGrid;

  // Restore orientation
  if (direction === Direction.RIGHT) {
    currentGrid = currentGrid.map((row) => row.reverse());
  } else if (direction === Direction.UP) {
    currentGrid = rotateRight(currentGrid); // Inverse of Rotate Left
  } else if (direction === Direction.DOWN) {
    currentGrid = rotateLeft(currentGrid); // Inverse of Rotate Right
  }

  const moved = !gridsEqual(grid, currentGrid);
  return { grid: currentGrid, score: scoreToAdd, moved };
};
