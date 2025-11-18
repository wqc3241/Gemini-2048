import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Direction, Grid } from './types';
import { getEmptyGrid, addRandomTile, moveGrid, checkGameOver } from './utils/gameLogic';
import { getBestMove } from './services/geminiService';
import Board from './components/Board';
import Header from './components/Header';
import GameOverModal from './components/GameOverModal';
import GeminiControls from './components/GeminiControls';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    grid: getEmptyGrid(),
    score: 0,
    bestScore: 0,
    gameOver: false,
    won: false,
    previousGrid: null,
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{ direction: Direction; reasoning: string } | null>(null);
  
  // Refs for swipe detection
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const processingRef = useRef(false);

  // Initialize Game
  const initGame = useCallback(() => {
    let newGrid = getEmptyGrid();
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    
    const savedBest = localStorage.getItem('2048-best-score');
    
    setGameState({
      grid: newGrid,
      score: 0,
      bestScore: savedBest ? parseInt(savedBest, 10) : 0,
      gameOver: false,
      won: false,
      previousGrid: null,
    });
    setAiSuggestion(null);
  }, []);

  // Load best score on mount
  useEffect(() => {
    initGame();
  }, [initGame]);

  // Persist best score
  useEffect(() => {
    if (gameState.bestScore > 0) {
      localStorage.setItem('2048-best-score', gameState.bestScore.toString());
    }
  }, [gameState.bestScore]);

  // Move Handler
  const handleMove = useCallback((direction: Direction) => {
    if (gameState.gameOver || processingRef.current) return;
    
    processingRef.current = true;

    const { grid: newGrid, score: moveScore, moved } = moveGrid(gameState.grid, direction);

    if (moved) {
      const gridWithRandom = addRandomTile(newGrid);
      const newScore = gameState.score + moveScore;
      const newBest = Math.max(newScore, gameState.bestScore);
      
      // Check Win (2048 tile exists)
      const hasWon = !gameState.won && gridWithRandom.flat().some(cell => cell === 2048);
      const isOver = checkGameOver(gridWithRandom);

      setGameState(prev => ({
        ...prev,
        grid: gridWithRandom,
        score: newScore,
        bestScore: newBest,
        won: prev.won || hasWon, // Keep won state true if already won and continuing
        gameOver: isOver,
        previousGrid: prev.grid
      }));
      
      // Clear previous AI suggestion on move
      setAiSuggestion(null);
    }
    
    // Slight delay to prevent move spamming
    setTimeout(() => {
      processingRef.current = false;
    }, 100);
  }, [gameState]);

  // Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          handleMove(Direction.UP);
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleMove(Direction.DOWN);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleMove(Direction.LEFT);
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleMove(Direction.RIGHT);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, gameState.gameOver]);

  // Swipe Controls
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };

    const dx = touchEnd.x - touchStartRef.current.x;
    const dy = touchEnd.y - touchStartRef.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 30) { // Threshold
        if (absDx > absDy) {
            handleMove(dx > 0 ? Direction.RIGHT : Direction.LEFT);
        } else {
            handleMove(dy > 0 ? Direction.DOWN : Direction.UP);
        }
    }
    
    touchStartRef.current = null;
  };

  // AI Handler
  const handleAskAI = async () => {
    setAiLoading(true);
    setAiSuggestion(null);
    const result = await getBestMove(gameState.grid);
    setAiLoading(false);
    if (result) {
      setAiSuggestion(result);
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#faf8ef] flex flex-col items-center py-10 px-4 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Header 
        score={gameState.score} 
        bestScore={gameState.bestScore} 
        onReset={initGame} 
      />

      <div className="relative">
        <Board grid={gameState.grid} />
        {(gameState.gameOver || (gameState.won && !gameState.previousGrid /* Hacky way to show win only once if we wanted strict win modal, but here we just let them play */)) && (
           gameState.gameOver && <GameOverModal won={gameState.won && checkGameOver(gameState.grid) /* Only show won if strictly won and over? Actually, usually 2048 lets you continue. Let's just show Game Over modal on actual game over. */} onRetry={initGame} />
        )}
        {/* If game is strictly over (no moves) */}
        {gameState.gameOver && <GameOverModal won={gameState.won && !gameState.grid.flat().some(c => c === 0)} onRetry={initGame} />}
      </div>

      <GeminiControls 
        onAskAI={handleAskAI} 
        loading={aiLoading} 
        suggestion={aiSuggestion} 
      />
      
      <div className="mt-8 text-[#776e65] text-center max-w-md text-sm">
        <p className="mb-2"><strong>HOW TO PLAY:</strong> Use your <strong>arrow keys</strong> or <strong>swipe</strong> to move the tiles. Tiles with the same number merge into one when they touch.</p>
        <p>Powered by <strong>Gemini 2.5 Flash</strong> to help you solve the puzzle.</p>
      </div>
    </div>
  );
};

export default App;
