import victim from "../../assets/modifier/victim.png"
import vote from "../../assets/icon/vote.png"
import dead from "../../assets/icon/dead.png"
import anvil from "../../assets/icon/anvil.png"
import love from "../../assets/modifier/lover.png"
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

export default function GameProtocol({ game, className }: { game: Game, className?: string }) {
	if(!game.protocol) return
	return (
		<Card className={ className }>
			<CardHeader className="py-2 font-bold text-lg">Spiel-Protokoll</CardHeader>
			<Divider/>
			<CardBody>
				<ScrollShadow>
					<ul className="flex flex-col gap-2">
						{ game.protocol!.map(e => <Entry game={ game } entry={ e }/>) }
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
		case "DEATH": return <><Image src={ dead } width="20px"/><PlayerName role bold player={ game.players.find(p => p.id === entry.data[0] as never)! }/> ist gestorben ({ killReasonNames.get(entry.data[1] as never) })</>
		case "END": return <><CircleStop className="text-danger" width="20px"/> Spiel beendet</>
		case "AMOR": return <><Image src={ love } width="20px"/>Amor <PlayerName modifier={ false } bold player={ game.players.find(p => p.id === entry.data[0] as never)! }/>, <PlayerName modifier={ false } bold player={ game.players.find(p => p.id === entry.data[1] as never)! }/></>
		case "SEER": return <><Image src={ viewIcon } width="20px"/> Seherin schaut <PlayerName bold player={ game.players.find(p => p.id === entry.data[0] as never)! }/> an</>
		case "AURA_SEER": return <><Image src={ viewIcon } width="20px"/> Aura-Seher schaut <PlayerName role bold player={ game.players.find(p => p.id === entry.data[0] as never)! }/> an</>
		case "WARLOCK_VIEW": return <><Image src={ viewIcon } width="20px"/> Hexenmeister schaut <PlayerName role bold player={ game.players.find(p => p.id === entry.data[0] as never)! }/> an</>
		case "WARLOCK_MARK": return <><Image src={ markIcon } width="20px"/> Hexenmeister markiert <PlayerName role bold player={ game.players.find(p => p.id === entry.data[0] as never)! }/></>
		case "WEREWOLF": return <><Image src={ victim } width="20px"/> Werslimes greifen <PlayerName role bold player={ game.players.find(p => p.id === entry.data[0] as never)! }/> an</>
		case "WITCH_HEAL": return <><Image src={ healIcon } width="20px"/> Hexe heilt <PlayerName role bold player={ game.players.find(p => p.id === entry.data[0] as never)! }/></>
		case "WITCH_POISON": return <><Image src={ poisonIcon } width="20px"/> Hexe vergiftet <PlayerName role bold player={ game.players.find(p => p.id === entry.data[0] as never)! }/></>
		case "HUNTER": return <><Image src={ shootIcon } width="20px"/> Jäger schießt auf <PlayerName role bold player={ game.players.find(p => p.id === entry.data[0] as never)! }/></>
		case "VILLAGER": return <><Image src={ anvil } width="20px"/> Dorf henkt <PlayerName role bold player={ game.players.find(p => p.id === entry.data[0] as never)! }/></>
		case "VILLAGER_ELECT": return <><Image src={ vote } width="20px"/> <PlayerName role bold player={ game.players.find(p => p.id === entry.data[0] as never)! }/> wird Bürgermeister</>
	}
}

//<PlayerName bold player={ game.players.find(p => p.id === entry.data[0] as never)! }/>