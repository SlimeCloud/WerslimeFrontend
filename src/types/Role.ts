import neutral from "../assets/roles/default.png"
import villager from "../assets/roles/villager.png"
import wolf from "../assets/roles/wolf.png"
import witch from "../assets/roles/witch.png"
import hunter from "../assets/roles/hunter.png"
import jester from "../assets/roles/jester.png"
import amor from "../assets/roles/amor.png"
import seer from "../assets/roles/seer.png"
import aura_seer from "../assets/roles/aura_seer.png"
import mayor from "../assets/roles/mayor.png"
import { ReactNode } from "react"
import { Player } from "./Player.ts"

export type Team = "VILLAGE" | "WEREWOLF" | "NEUTRAL"

export type Role =
	"UNKNOWN" |
	"MAYOR" |
	"LOVER" |
	"VILLAGER_ELECT" |

	"AMOR" |
	"SEER" |
	"AURA_SEER" |
	"WEREWOLF" |
	"WITCH" |
	"VILLAGER" |
	"HUNTER" |
	"JESTER"

export const roleNames = new Map<Role, string>([
	[ "UNKNOWN", "Unbekannt" ],
	[ "MAYOR", "Bürgermeister" ],
	[ "VILLAGER_ELECT", "Dorfbewohner (Bürgermeister-Wahl)" ],

	[ "AMOR", "Amor" ],
	[ "SEER", "Seherin" ],
	[ "AURA_SEER", "Aura-Seher" ],
	[ "WEREWOLF", "Werslime" ],
	[ "WITCH", "Hexe" ],
	[ "VILLAGER", "Dorfbewohner" ],
	[ "HUNTER", "Jäger" ],
	[ "JESTER", "Narr" ]
])

export const roleTeams = new Map<Role, Team>([
	[ "AMOR", "VILLAGE" ],
	[ "SEER", "VILLAGE" ],
	[ "AURA_SEER", "VILLAGE" ],
	[ "WEREWOLF", "WEREWOLF" ],
	[ "WITCH", "VILLAGE" ],
	[ "VILLAGER", "VILLAGE" ],
	[ "HUNTER", "VILLAGE" ],
	[ "JESTER", "NEUTRAL" ]
])

export const teamColors = new Map<Team, "primary" | "warning" | "danger">([
	[ "VILLAGE", "primary" ],
	[ "NEUTRAL", "warning" ],
	[ "WEREWOLF", "danger" ]
])

export const teamNames = new Map<Team, string>([
	[ "VILLAGE", "Dorf" ],
	[ "NEUTRAL", "Neutral" ],
	[ "WEREWOLF", "Werwolf" ]
])

export const roleImages = new Map<Role, string>([
	[ "UNKNOWN", neutral ],
	[ "MAYOR", mayor ],
	[ "VILLAGER_ELECT", villager ],

	[ "AMOR", amor ],
	[ "SEER", seer ],
	[ "AURA_SEER", aura_seer ],
	[ "WEREWOLF", wolf ],
	[ "WITCH", witch ],
	[ "VILLAGER", villager ],
	[ "HUNTER", hunter ],
	[ "JESTER", jester ]
])

export const roleDescriptions = new Map<Role, ReactNode>([
	[ "WITCH", "Kann eine Person heilen und eine Person vergiften" ],
	[ "AMOR", "Kann zwei Personen verlieben" ],
	[ "SEER", "Kann jede Nacht die Rolle einer Person ansehen" ],
	[ "HUNTER", "Kann wenn er stirbt eine weitere Person erschießen" ],
	[ "AURA_SEER", "Kann jede Nacht das Team einer Person ansehen" ],
	[ "JESTER", "Gewinnt, wenn er vom Dorf gehenkt wird" ]
])

export function isRoleActive(player: Player, role: Role) {
	return role === "VILLAGER" || role === "VILLAGER_ELECT" || player.role === role
}