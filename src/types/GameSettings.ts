import { Role } from "./Role.ts"

export interface GameSettings {
	werewolfAmount: number
	muteSystem: MuteSystem
	roles: Role[]

	isPublic: boolean
	revealDeadRoles: boolean
	deadSpectators: boolean
	revealLoverRoles: boolean
	storyMode: boolean
}

export type MuteSystem =
	"NONE" |
	"FULL" |
	"DEAD_ONLY"