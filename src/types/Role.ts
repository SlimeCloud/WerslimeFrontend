import neutral from "../assets/roles/default.png"
import villager from "../assets/roles/villager.png"
import wolf from "../assets/roles/wolf.png"
import witch from "../assets/roles/witch.png"
import hunter from "../assets/roles/hunter.png"
import seer from "../assets/roles/seer.png"
import mayor from "../assets/roles/mayor.png"

export type Role =
	"UNKNOWN" |
	"MAYOR" |

	"SEER" |
	"WEREWOLF" |
	"WITCH" |
	"VILLAGER" |
	"HUNTER"

export const specialRoles: Role[] = [ "WITCH", "SEER", "HUNTER" ]

export const roleNames = new Map<Role, string>([
	[ "UNKNOWN", "Unbekannt" ],
	[ "MAYOR", "Bürgermeister" ],

	[ "SEER", "Seherin" ],
	[ "WEREWOLF", "Werslime" ],
	[ "WITCH", "Hexe" ],
	[ "VILLAGER", "Dorfbewohner" ],
	[ "HUNTER", "Jäger" ],
])

export const roleImages = new Map<Role, string>([
	[ "UNKNOWN", neutral ],
	[ "MAYOR", mayor ],

	[ "SEER", seer ],
	[ "WEREWOLF", wolf ],
	[ "WITCH", witch ],
	[ "VILLAGER", villager ],
	[ "HUNTER", hunter ],
])