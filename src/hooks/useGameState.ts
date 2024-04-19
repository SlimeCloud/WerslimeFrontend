import { createContext, useContext } from "react";
import { GameState } from "../types/GameState.ts";

export const GameStateContext = createContext<GameState | undefined>(undefined)

export function useGameState() {
	return useContext(GameStateContext)
}