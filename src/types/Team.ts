import jester from "../assets/roles/jester.png"
import lover from "../assets/modifier/lover.png"
import werewolf from "../assets/roles/werslime.png"
import village from "../assets/roles/villager.png"

export type Team =
	"JESTER" |
	"LOVER" |
	"WEREWOLF" |
	"VILLAGE"

export const teamNames = new Map<Team, string>([
	[ "JESTER", "Der Narr" ],
	[ "LOVER", "Die Verliebten" ],
	[ "WEREWOLF", "Die Werslimes" ],
	[ "VILLAGE", "Das Dorf" ]
])

export const teamImages = new Map<Team, string>([
	[ "JESTER", jester ],
	[ "LOVER", lover ],
	[ "WEREWOLF", werewolf ],
	[ "VILLAGE", village ]
])