import { Role } from "./Role.ts";
import { Player } from "./Player.ts"

export interface Game {
	id: string
	players: Player[]

	started: boolean
	settings: GameSettings

	current: Role
	victim?: string

	interactions?: object
	interacted: number
	total: number

	roleMeta: object
}

export interface GameSettings {
	werewolfAmount: number
	roles: Role[]

	isPublic: boolean
	revealDeadRoles: boolean
	deadSpectators: boolean
}