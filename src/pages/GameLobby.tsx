import { useGameState } from "../hooks/useGameState.ts";

export default function GameLobby() {
	const gameState = useGameState()

	return (
		<>
			Lobby: { gameState?.game.id }
		</>
	)
}