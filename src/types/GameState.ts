import { Game } from "./Game.ts";
import { Player } from "./Player.ts";

export interface GameState {
	game: Game
	player: Player
}