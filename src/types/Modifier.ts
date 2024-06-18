import mayor from "../assets/modifier/mayor.png"
import lover from "../assets/modifier/lover.png"
import shield from "../assets/action/shield.png"

export type Modifier =
	"MAYOR" |
	"LOVER" |
	"SHIELD"

export const modifierNames = new Map<Modifier, string>([
	[ "MAYOR", "Bürgermeister" ],
	[ "LOVER", "Verliebt" ],
	[ "SHIELD", "Beschützt" ]
])

export const modifierImages = new Map<Modifier, string>([
	[ "MAYOR", mayor ],
	[ "LOVER", lover ],
	[ "SHIELD", shield ]
])