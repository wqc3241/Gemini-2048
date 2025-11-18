export const GRID_SIZE = 4;

export const TILE_COLORS: Record<string, string> = {
  0: "bg-[#cdc1b4]",
  2: "bg-[#eee4da] text-[#776e65]",
  4: "bg-[#ede0c8] text-[#776e65]",
  8: "bg-[#f2b179] text-white",
  16: "bg-[#f59563] text-white",
  32: "bg-[#f67c5f] text-white",
  64: "bg-[#f65e3b] text-white",
  128: "bg-[#edcf72] text-white text-4xl",
  256: "bg-[#edcc61] text-white text-4xl",
  512: "bg-[#edc850] text-white text-4xl",
  1024: "bg-[#edc53f] text-white text-3xl",
  2048: "bg-[#edc22e] text-white text-3xl shadow-[0_0_30px_10px_rgba(243,215,116,0.5)]",
  super: "bg-[#3c3a32] text-[#f9f6f2]", // Fallback for > 2048
};

export const AI_SYSTEM_INSTRUCTION = `
You are a grandmaster of the game 2048. 
Your goal is to analyze the provided 4x4 grid and suggest the absolute best next move to maximize the score and keep the board clean.
Focus on corner strategies and keeping high value tiles together.
You must output valid JSON containing two fields:
1. "direction": One of "UP", "DOWN", "LEFT", "RIGHT".
2. "reasoning": A very short, concise sentence (max 10 words) explaining why.
`;