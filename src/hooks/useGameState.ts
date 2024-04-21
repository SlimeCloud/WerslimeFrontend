import { createContext, useContext } from "react";
import { GameState } from "../types/GameState.ts";
import { RestRoute } from "./useRest.ts"

export const GameStateContext = createContext<GameState | undefined>(undefined)
export const GameStateRequestContext = createContext<RestRoute<GameState> | undefined>(undefined)

export function useGameState() {
	return useContext(GameStateContext)
}

export function useGameStateRequest() {
	return useContext(GameStateRequestContext)
}