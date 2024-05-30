export type ProtocolType =
	"START" |
	"AMOR" |
	"SEER" |
	"AURA_SEER" |
	"WARLOCK_VIEW" |
	"WARLOCK_MARK" |
	"WEREWOLF" |
	"WITCH_HEAL" |
	"WITCH_POISON" |
	"HUNTER" |
	"VILLAGER" |
	"VILLAGER_ELECT" |
	"DEATH" |
	"END"

export interface ProtocolEntry {
	id: string
	type: ProtocolType
	data: object[]
}

export type KillReason =
	"UNKNOWN" |
	"VILLAGE_VOTE" |
	"WEREWOLF_ATTACK" |
	"WITCH_POISON" |
	"HUNTER" |
	"LOVER"

export const killReasonNames = new Map<KillReason, string>([
	[ "UNKNOWN", "Unbekannt" ],
	[ "VILLAGE_VOTE", "Gehenkt"],
	[ "WEREWOLF_ATTACK", "Werslimes" ],
	[ "WITCH_POISON", "Hexe" ],
	[ "HUNTER", "Jäger"],
	[ "LOVER", "Verliebter" ]
])