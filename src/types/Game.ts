import { Role } from "./Role.ts";
import { Player } from "./Player.ts"
import { GameSettings } from "./GameSettings.ts"
import { ProtocolEntry } from "./GameProtocol.ts"

export interface Game {
	id: string
	discord: boolean
	players: Player[]

	started: boolean
	settings: GameSettings

	current: Role
	victim?: string

	interactions?: object
	roleMeta: object

	target?: string,
	interacted: number
	total: number,
	valid: boolean,

	protocol?: ProtocolEntry[]
}

