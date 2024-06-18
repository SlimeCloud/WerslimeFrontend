import neutral from "../assets/roles/default.png"
import mayor from "../assets/roles/mayor.png"

import amor from "../assets/roles/amor.png"
import seer from "../assets/roles/seer.png"
import aura_seer from "../assets/roles/aura_seer.png"
import warlock from "../assets/roles/warlock.png"
import healer from "../assets/roles/healer.png"
import werewolf from "../assets/roles/werslime.png"
import witch from "../assets/roles/witch.png"
import villager from "../assets/roles/villager.png"
import hunter from "../assets/roles/hunter.png"
import jester from "../assets/roles/jester.png"
import spy from "../assets/roles/spy.png"

import { ReactNode } from "react"
import { Player } from "./Player.ts"

export type Role =
	"UNKNOWN" |
	"MAYOR" |
	"VILLAGER_ELECT" |

	"AMOR" |
	"SEER" |
	"AURA_SEER" |
	"WARLOCK" |
	"HEALER" |
	"WEREWOLF" |
	"WITCH" |
	"VILLAGER" |
	"HUNTER" |
	"JESTER" |
	"SPY"

export const roleNames = new Map<Role, string>([
	[ "UNKNOWN", "Unbekannt" ],
	[ "MAYOR", "Bürgermeister" ],
	[ "VILLAGER_ELECT", "Bürgermeister-Wahl" ],

	[ "AMOR", "Amor" ],
	[ "SEER", "Seherin" ],
	[ "AURA_SEER", "Aura-Seher" ],
	[ "WARLOCK", "Hexenmeister" ],
	[ "HEALER", "Heiler" ],
	[ "WEREWOLF", "Werslime" ],
	[ "WITCH", "Hexe" ],
	[ "VILLAGER", "Dorfbewohner" ],
	[ "HUNTER", "Jäger" ],
	[ "JESTER", "Narr" ],
	[ "SPY", "Spion" ]
])

export const roleImages = new Map<Role, string>([
	[ "UNKNOWN", neutral ],
	[ "MAYOR", mayor ],
	[ "VILLAGER_ELECT", villager ],

	[ "AMOR", amor ],
	[ "SEER", seer ],
	[ "AURA_SEER", aura_seer ],
	[ "WARLOCK", warlock ],
	[ "HEALER", healer ],
	[ "WEREWOLF", werewolf ],
	[ "WITCH", witch ],
	[ "VILLAGER", villager ],
	[ "HUNTER", hunter ],
	[ "JESTER", jester ],
	[ "SPY", spy ]
])

export const roleDescriptions = new Map<Role, ReactNode>([
	[ "WITCH", "Kann eine Person heilen und eine Person vergiften" ],
	[ "AMOR", "Kann zwei Personen verlieben" ],
	[ "SEER", "Kann jede Nacht die Rolle einer Person ansehen" ],
	[ "HUNTER", "Kann wenn er stirbt eine weitere Person erschießen" ],
	[ "AURA_SEER", "Kann jede Nacht das Team einer Person ansehen" ],
	[ "JESTER", "Gewinnt, wenn er vom Dorf gehenkt wird" ],
	[ "HEALER", "Der Heile kann jede Nacht einen Spieler vor Werwolf-Attacken schützen" ],
	[ "SPY", "Dorfbewohner, der für Werwölfe als Werwolf angezeigt wird" ],
	[ "WARLOCK", "Seherin der Werslimes, hat eine Tarn-Rolle" ]
])

export function isRoleActive(player: Player, role: Role) {
	return role === "VILLAGER" || role === "VILLAGER_ELECT" || player.role === role
}

export function isChatActive(player: Player, role: Role) {
	return isRoleActive(player, role) || (role === "WEREWOLF" && player.role === "SPY")
}

export function hasChat(role: Role) {
	switch (role) {
		case "WEREWOLF":
		case "VILLAGER":
		case "VILLAGER_ELECT": return true
		default: return false
	}
}