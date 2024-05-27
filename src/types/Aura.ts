export type Aura =
	"HOSTILE" |
	"NEUTRAL" |
	"VILLAGE"

export const auraNames = new Map<Aura, string>([
	[ "HOSTILE", "Feindlich" ],
	[ "NEUTRAL", "Neutral" ],
	[ "VILLAGE", "Dorf" ]
])

export const auraColors = new Map<Aura, "primary" | "warning" | "danger">([
	[ "HOSTILE", "danger" ],
	[ "NEUTRAL", "warning" ],
	[ "VILLAGE", "primary" ]
])