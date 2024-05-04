import { Role } from "./Role.ts"

export interface GameSettings {
	werewolfAmount: number
	roles: Role[]

	isPublic: boolean
	revealDeadRoles: boolean
	deadSpectators: boolean
	revealLoverRoles: boolean
	muteSystem: MuteSystem
}

export type MuteSystem =
	"NONE" |
	"FULL" |
	"DEAD_ONLY"