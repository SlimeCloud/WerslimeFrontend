import { useGameState } from "../hooks/useGameState.ts";

export default function GameBoard() {
	const gameState = useGameState()

	return (
		<>
			Board: { gameState?.game.id }
		</>
	)
}