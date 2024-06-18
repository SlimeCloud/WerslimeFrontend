import { Role } from "./Role.ts";
import { Aura } from "./Aura.ts"
import { Modifier } from "./Modifier.ts"

export const EMPTY_PLAYER = {
	id: "",
	avatar: undefined,

	name: "",
	master: false,

	alive: false,
	connected: false,

	role: "UNKNOWN",
	aura: "VILLAGE",
	modifiers: []

} as Player

export interface Player {
	id: string
	avatar?: string

	name: string
	master: boolean

	alive: boolean
	connected: boolean

	role?: Role
	aura?: Aura
	modifiers: Modifier[]
}

export function getEffectiveRole(player: Player) {
	return player.role || (player.modifiers.includes("MAYOR") ? "MAYOR" : "UNKNOWN")
}