import { Role, Team } from "./Role.ts";

export const EMPTY_PLAYER = { id: "" } as Player

export interface Player {
	id: string
	avatar?: string

	name: string
	role: Role
	team: Team

	master: boolean
	alive: boolean
	mayor: boolean
	lover: boolean

	connected: boolean
}