import { Player } from "./Player.ts";
import { Role } from "./Role.ts";

export interface Game {
	id: string
	players: Player[]

	started: boolean
	settings: GameSettings

	current: Role
	victim?: string

	interacted: number
	total: number

	roleMeta: object
}

export interface GameSettings {
	werewolfAmount: number
	roles: Role[]
}