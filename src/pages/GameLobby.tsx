import { useGameState } from "../hooks/useGameState.ts";
import { Avatar, Button, Card, CardBody, CardHeader, Checkbox, CheckboxGroup, Divider, Modal, ModalBody, ModalContent, ModalHeader, Popover, PopoverContent, PopoverTrigger, Radio, RadioGroup, ScrollShadow, Slider, Tooltip, useDisclosure } from "@nextui-org/react";
import { Crown, ShieldPlus, Unplug, UserX } from "lucide-react";
import { Request, useRest } from "../hooks/useRest.ts";
import Spinner from "../components/Spinner.tsx";
import { Role, roleDescriptions, roleNames } from "../types/Role.ts"
import { Player } from "../types/Player.ts"
import ConditionalParent from "../components/ConditionalParent.tsx"
import ErrorModal from "../components/ErrorModal.tsx"

import { GameSettings, MuteSystem } from "../types/GameSettings.ts"
import SettingsDisplay, { SettingsProperty } from "./components/SettingsDisplay.tsx"
import { useCopyToClipboard } from "usehooks-ts";

export default function GameLobby() {
	return (
		<>
			<PlayerList/>
			<Settings/>
		</>
	)
}

function PlayerList() {
	const { del: kick } = useRest("/games/@me/members")
	const { patch: promote } = useRest("/games/@me/members")
	const { game } = useGameState()!

	const [ , copy] = useCopyToClipboard()
	const { isOpen, onOpen, onOpenChange } = useDisclosure()

	return (
		<Card shadow="sm" className="font-minecraft flex-shrink-0 md:flex-shrink md:w-1/2 select-none">
			<CardHeader className="text-2xl font-black flex justify-center">Mitspieler ({ game.players.length })</CardHeader>
			<Divider/>
			<CardBody>
				<ScrollShadow className="flex-grow">
					<ul className="flex flex-col gap-2">
						{ game.players.map(p =>
							<li key={ p.id } className="w-fit">
								<PlayerInfo p={ p } kick={ kick } promote={ promote }/>
							</li>
						) }
					</ul>
				</ScrollShadow>

				<Button onPress={ () => copy(window.location.href).then(onOpen) }>Einladung Kopieren</Button>

				<Modal isOpen={ isOpen } onOpenChange={ onOpenChange }>
					<ModalContent>
						<ModalHeader className="py-2 font-bold">Einladung Kopiert</ModalHeader>
						<Divider/>
						<ModalBody>
							Der Einladungs-Link wurde in die Zwischenablage kopiert. Teile diesen Link mit deinen Freunden, damit Sie dem Spiel beitreten können!
						</ModalBody>
					</ModalContent>
				</Modal>
			</CardBody>
		</Card>
	)
}

function PlayerInfo({ p, kick, promote }: { p: Player, kick: (req: Request<unknown>) => void, promote: (req: Request<unknown>) => void }) {
	const { player } = useGameState()!

	return (
		<ConditionalParent condition={ player.master && !p.master } parent={ children =>
			<Popover placement="right">
				<PopoverTrigger>
					<a className="cursor-pointer">
						{ children }
					</a>
				</PopoverTrigger>
				<PopoverContent className="bg-default-100">
					{ player.master &&
						<span className="flex gap-2 items-center">
						<span className="font-bold">Aktionen</span>
						<Tooltip content="Rauswerfen"><Button title="Rauswerfen" color="danger" size="sm" onPress={ () => kick({ path: `/${ p.id }` }) }><UserX/></Button></Tooltip>
						<Tooltip content="Zum Spielleiter machen"><Button title="Zum Spiel-Leiter machen" color="warning" size="sm" onPress={ () => promote({ path: `/${ p.id }`, data: { master: true } }) }><ShieldPlus/></Button></Tooltip>
					</span>
					}
				</PopoverContent>
			</Popover>
		}>
			<Tooltip
				placement="right" className="font-bold"
				content={
					p.id === player.id ? "Du" :
					p.master ? "Spiel-Leiter" :
					<>Mitspieler{ p.connected ? "" : <span className="text-default"> (Verbindung getrennt)</span> }</>
				}
			>
				<span className="flex gap-2 items-center">
					<span>-</span>
					{ p.avatar && <Avatar size="sm" src={ p.avatar } className="transition-transform h-[25px] w-[25px]"/> }
					<span className={ `${ p.id === player.id ? "text-primary" : "" }` }>{ p.name }</span>
					{ p.master && <Crown color="gold" width="20px"/> }
					{ !p.connected && <Unplug color="red" width="20px"/> }
				</span>
			</Tooltip>
		</ConditionalParent>
	)
}

function Settings() {
	const { game, player } = useGameState()!

	const { isOpen, onOpen, onOpenChange } = useDisclosure()

	const { state: startState, put: start } = useRest("/games/@me/session")
	const { state: updateState, error, patch: update } = useRest<GameSettings>("/games/@me", {
		onError: onOpen
	})

	const disabled = !player.master || updateState === "loading"

	return (
		<>
			<Card shadow="sm" className="font-minecraft md:w-1/2 select-none" isDisabled={ updateState === "loading" }>
				<CardHeader className="text-2xl font-black flex justify-center">Einstellungen</CardHeader>
				<Divider/>
				<CardBody className="flex flex-col justify-between gap-4">
					<div className="flex flex-col gap-5 [&_h3]:font-bold">
						<SettingsProperty<number> game={ game } property="werewolfAmount" update={ update } autoUpdate={ false }>{ (value, setValue, update) =>
							<div>
								<h3 className="flex flex-row justify-between">Werslime Anzahl <span>{ value }</span></h3>
								<Slider
									aria-label="Werwolf Anzahl" className="font-bold [&_*]:!text-md" size="md"
									minValue={ 1 } maxValue={ 10 } step={ 1 } showSteps
									value={ value }
									onChange={ value => setValue(value as number) }
									onChangeEnd={ value => update(value as number) }
									isDisabled={ disabled }
								/>
							</div> }
						</SettingsProperty>

						<div className="flex gap-4 justify-between flex-row flex-wrap [&>div]:flex [&>div]:flex-col [&>div]:gap-1">
							<SettingsProperty<Role[]> game={ game } property="roles" compare={ (a, b) => a.toString() == b.toString() } update={ update }>{ (value, setValue) =>
								<div>
									<h3>Rollen</h3>
									<CheckboxGroup
										aria-label="Spezial-Rollen" size="md" className="[&>div]:gap-1"
										value={ value }
										onValueChange={ values => setValue(values as Role[]) }
										isDisabled={ disabled }
									>
										{ [ ...roleDescriptions.entries() ].map(([ role, description ]) =>
											<Tooltip key={ role } shouldFlip={ false } placement="right" content={ description }>
												<div className="w-fit">
													<Checkbox value={ role }>{ roleNames.get(role) }</Checkbox>
												</div>
											</Tooltip>
										) }
									</CheckboxGroup>
								</div> }
							</SettingsProperty>

							<div>
								<h3>Sonstiges</h3>
								<SettingsDisplay game={ game } disabled={ disabled } update={ update }/>
							</div>

							{ game.discord ?
								<div>
									<h3>Mitglieder Muten</h3>
									<SettingsProperty<MuteSystem> game={ game } property="muteSystem" update={ update }>{ (value, setValue) =>
										<RadioGroup isDisabled={ disabled } aria-label="Mitglieder Muten" orientation="vertical" value={ value } onValueChange={ v => setValue(v as MuteSystem) }>
											<Tooltip content="Deaktiviert"><Radio value="NONE">Deaktiviert</Radio></Tooltip>
											<Tooltip content="Tote muten, Nachts muten und deafen"><Radio value="FULL">Vollständig</Radio></Tooltip>
											<Tooltip content="Nur Tote muten"><Radio value="DEAD_ONLY">Nur Tote</Radio></Tooltip>
										</RadioGroup> }
									</SettingsProperty>
								</div> :
								<div/>
							}
						</div>
					</div>

					{ player.master && <Button className="font-bold min-h-[28px] flex-shrink-0" isDisabled={ game.settings.werewolfAmount >= game.players.length / 2.0 } isLoading={ startState === "loading" } spinner={ <Spinner/> } onPress={ () => start() }>Runde Starten</Button> }
				</CardBody>
			</Card>
			<ErrorModal error={ error! } isOpen={ isOpen } onOpenChange={ onOpenChange }/>
		</>
	)
}