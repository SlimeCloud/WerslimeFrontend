import { useGameState } from "../hooks/useGameState.ts";
import { Button, Card, CardBody, CardHeader, Divider, ScrollShadow, Slider, Tooltip } from "@nextui-org/react";
import { Crown, ShieldPlus, Unplug, UserX } from "lucide-react";
import { useRest } from "../hooks/useRest.ts";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner.tsx";

export default function GameLobby() {
	return (
		<>
			<PlayerList/>
			<Settings/>
		</>
	)
}

function PlayerList() {
	const { post: kick } = useRest("/game/kick")
	const { post: promote } = useRest("/game/promote")
	const { game, player } = useGameState()!

	return (
		<Card shadow="sm" className="flex-grow md:w-1/2">
			<CardHeader className="text-2xl font-black flex justify-center">Mitspieler</CardHeader>
			<Divider/>
			<CardBody>
				<ScrollShadow>
					<ul className="flex flex-col gap-2">
						{ game.players.map(p =>
							<li key={ p.id } className="w-fit">
								<Tooltip
									placement="right-end"
									className="font-bold"
									content={ p.master ? "Spiel-Leiter" : !player.master ? "Mitspieler" :
										<span className="flex gap-2 items-center">
											<span>Aktionen</span>
											<Button title="Rauswerfen" color="danger" size="sm" onPress={ () => kick({ data: { id: p.id } }) }><UserX/></Button>
											<Button title="Zum Spielleiter machen" color="warning" size="sm" onPress={ () => promote({ data: { id: p.id } }) }><ShieldPlus/></Button>
										</span>
									}
								>
									<span className={ `flex gap-2 ${ p.id === player.id ? "font-bold" : "" }` }>
										<span>-</span>
										{ p.name }
										{ p.master && <Crown color="gold" width="20px"/> }
										{ !p.connected && <Unplug color="red" width="20px"/> }
									</span>
								</Tooltip>
							</li>
						) }
					</ul>
				</ScrollShadow>
			</CardBody>
		</Card>
	)
}

function Settings() {
	const { game, player } = useGameState()!

	const { state: startState, post: start } = useRest("/game/start")
	const { state: updateState, post: update } = useRest("/game/settings")

	const disabled = !player.master || updateState === "loading"

	const [ amount, setAmount ] = useState<number>(game.settings.werewolfAmount)

	function updateSettings(werewolfAmount?: number) {
		update({
			data: {
				werewolfAmount: werewolfAmount || amount,
				roles: []
			}
		})
	}

	useEffect(() => {
		setAmount(game.settings.werewolfAmount)
	}, [ game.settings ])

	return (
		<Card shadow="sm" className="flex-grow md:w-1/2" isDisabled={ updateState === "loading" }>
			<CardHeader className="text-2xl font-black flex justify-center">Einstellungen</CardHeader>
			<Divider/>
			<CardBody className="flex flex-col justify-between">
				<Slider
					label="Werwolf Anzahl" className="font-bold [&_*]:!text-md" size="md"
					minValue={ 1 } maxValue={ 10 } step={ 1 } showSteps
					value={ amount }
					onChange={ value => setAmount(value as number) }
					onChangeEnd={ value => updateSettings(value as number) }
					isDisabled={ disabled }
				/>

				{ player.master && <Button className="font-bold" isLoading={ startState === "loading" } spinner={ <Spinner/> } onPress={ () => start() }>Runde Starten</Button> }
			</CardBody>
		</Card>
	)
}