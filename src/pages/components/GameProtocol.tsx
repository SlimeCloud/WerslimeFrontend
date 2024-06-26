import werslime from "../../assets/roles/werslime.png"
import victim from "../../assets/modifier/victim.png"
import vote from "../../assets/icon/vote.png"
import dead from "../../assets/icon/dead.png"
import anvil from "../../assets/icon/anvil.png"
import love from "../../assets/modifier/lover.png"
import shieldIcon from "../../assets/action/shield.png"
import healIcon from "../../assets/action/heal.png"
import poisonIcon from "../../assets/action/poison.png"
import viewIcon from "../../assets/action/view.png"
import shootIcon from "../../assets/action/shoot.png"
import markIcon from "../../assets/action/mark.png"

import { killReasonNames, ProtocolEntry } from "../../types/GameProtocol.ts"
import { Card, CardBody, CardHeader, Divider, Image, ScrollShadow } from "@nextui-org/react"
import { ReactNode } from "react"
import { Game } from "../../types/Game.ts"
import PlayerName from "./PlayerName.tsx"
import { CirclePlay, CircleStop } from "lucide-react"
import { Player } from "../../types/Player.ts"

export default function GameProtocol({ game, className }: { game: Game, className?: string }) {
	if(!game.protocol) return
	return (
		<Card className={ className }>
			<CardHeader className="py-2 font-bold text-lg">Spiel-Protokoll</CardHeader>
			<Divider/>
			<CardBody>
				<ScrollShadow>
					<ul className="flex flex-col gap-2">
						{ game.protocol!.map(e => <Entry key={ e.id } game={ game } entry={ e }/>) }
					</ul>
				</ScrollShadow>
			</CardBody>
		</Card>
	)
}

function Entry({ game, entry }: { game: Game, entry: ProtocolEntry }) {
	return (
		<li key={ entry.id } className="flex gap-2 items-center">
			{ formatEntry(game, entry) }
		</li>
	)
}

function formatEntry(game: Game, entry: ProtocolEntry): ReactNode {
	switch(entry.type) {
		case "START": return <><CirclePlay className="text-primary" width="20px"/> Spiel gestartet</>
		case "DEATH": return <><Image src={ dead } width="20px"/><PlayerDisplay game={ game } condition={ p => p.id === entry.data[0] as never }/> ist gestorben ({ killReasonNames.get(entry.data[1] as never) })</>
		case "END": return <><CircleStop className="text-danger" width="20px"/> Spiel beendet</>
		case "AMOR": return <><Image src={ love } width="20px"/>Amor verliebt <PlayerDisplay game={ game } modifier={ false } condition={ p => p.id === entry.data[0] as never }/> und <PlayerDisplay game={ game } modifier={ false } condition={ p => p.id === entry.data[1] as never }/></>
		case "SEER": return <><Image src={ viewIcon } width="20px"/> Seherin schaut <PlayerDisplay game={ game } condition={ p => p.id === entry.data[0] as never }/> an</>
		case "AURA_SEER": return <><Image src={ viewIcon } width="20px"/> Aura-Seher schaut <PlayerDisplay game={ game } condition={ p => p.id === entry.data[0] as never }/> an</>
		case "WARLOCK_VIEW": return <><Image src={ viewIcon } width="20px"/> Hexenmeister schaut <PlayerDisplay game={ game } condition={ p => p.id === entry.data[0] as never }/> an</>
		case "WARLOCK_MARK": return <><Image src={ markIcon } width="20px"/> Hexenmeister markiert <PlayerDisplay game={ game } condition={ p => p.id === entry.data[0] as never }/></>
		case "HEALER": return <><Image src={ shieldIcon } width="20px"/> Heiler beschützt <PlayerDisplay game={ game } condition={ p => p.id === entry.data[0] as never }/></>
		case "WEREWOLF": return <><Image src={ victim } width="20px"/> Werslimes greifen <PlayerDisplay game={ game } condition={ p => p.id === entry.data[0] as never }/> an</>
		case "WEREWOLF_HEALER": return <><Image src={ werslime } width="20px"/> Werslimes greifen <PlayerDisplay game={ game } condition={ p => p.id === entry.data[0] as never }/> an (<Image src={ shieldIcon } width="20px"/>)</>
		case "WITCH_HEAL": return <><Image src={ healIcon } width="20px"/> Hexe heilt <PlayerDisplay game={ game } condition={ p => p.id === entry.data[0] as never }/></>
		case "WITCH_POISON": return <><Image src={ poisonIcon } width="20px"/> Hexe vergiftet <PlayerDisplay game={ game } condition={ p => p.id === entry.data[0] as never }/></>
		case "HUNTER": return <><Image src={ shootIcon } width="20px"/> Jäger schießt auf <PlayerDisplay game={ game } condition={ p => p.id === entry.data[0] as never }/></>
		case "VILLAGER": return <><Image src={ anvil } width="20px"/> Dorf henkt <PlayerDisplay game={ game } condition={ p => p.id === entry.data[0] as never }/></>
		case "VILLAGER_ELECT": return <><Image src={ vote } width="20px"/> <PlayerDisplay game={ game } condition={ p => p.id === entry.data[0] as never }/> wird Bürgermeister</>
	}
}

function PlayerDisplay({ game, condition, modifier = true }: { game: Game, condition: (player: Player) => boolean, modifier?: boolean }) {
	return <PlayerName role bold modifier={ modifier } player={ game.players.find(p => condition(p))! } className="bg-default-200 px-1 py-0.5 rounded-xl"/>
}