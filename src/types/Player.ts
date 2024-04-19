import { Role } from "./Role.ts";

export interface Player {
	id: string
	name: string
	role: Role

	master: boolean
	alive: boolean
	mayor: boolean
}