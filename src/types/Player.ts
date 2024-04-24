import { Role, Team } from "./Role.ts";

export interface Player {
	id: string
	name: string
	role: Role
	team: Team

	master: boolean
	alive: boolean
	mayor: boolean
	lover: boolean

	connected: boolean
}