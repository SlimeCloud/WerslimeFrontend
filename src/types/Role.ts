export type Role =
	"SEER" |
	"WEREWOLF" |
	"WITCH" |
	"VILLAGER" |
	"HUNTER"

export const specialRoles: Role[] = [ "WITCH", "SEER", "HUNTER" ]

export const roleNames = new Map<Role, string>([
	[ "SEER", "Seherin" ],
	[ "WEREWOLF", "Werslime" ],
	[ "WITCH", "Hexe" ],
	[ "VILLAGER", "Dorfbewohner" ],
	[ "HUNTER", "Jäger" ],
])