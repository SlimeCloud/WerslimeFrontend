import { useGameState } from "../hooks/useGameState.ts";
import { Avatar, Button, Card, CardBody, CardHeader, Checkbox, CheckboxGroup, Divider, Popover, PopoverContent, PopoverTrigger, ScrollShadow, Slider, Tooltip, useDisclosure } from "@nextui-org/react";
import { Crown, ShieldPlus, Unplug, UserX } from "lucide-react";
import { Request, useRest } from "../hooks/useRest.ts";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner.tsx";
import { Role, roleDescriptions, roleNames, roleTeams, teamColors } from "../types/Role.ts"
import { Player } from "../types/Player.ts"
import ConditionalParent from "../components/ConditionalParent.tsx"
import ErrorModal from "../components/ErrorModal.tsx"

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
	const { game } = useGameState()!

	return (
		<Card shadow="sm" className="flex-shrink-0 md:flex-shrink md:w-1/2 select-none">
			<CardHeader className="text-2xl font-black flex justify-center">Mitspieler ({ game.players.length })</CardHeader>
			<Divider/>
			<CardBody>
				<ScrollShadow className="h-full">
					<ul className="flex flex-col gap-2">
						{ game.players.map(p =>
							<li key={ p.id } className="w-fit">
								<PlayerInfo p={ p } kick={ kick } promote={ promote }/>
							</li>
						) }
					</ul>
				</ScrollShadow>
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
				<PopoverContent>
					{ player.master &&
						<span className="flex gap-2 items-center">
						<span className="font-bold">Aktionen</span>
						<Tooltip content="Rauswerfen"><Button title="Rauswerfen" color="danger" size="sm" onPress={ () => kick({ data: { id: p.id } }) }><UserX/></Button></Tooltip>
						<Tooltip content="Zum Spielleiter machen"><Button title="Zum Spiel-Leiter machen" color="warning" size="sm" onPress={ () => promote({ data: { id: p.id } }) }><ShieldPlus/></Button></Tooltip>
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
				<span className={ `flex gap-2 items-center ${ p.id === player.id ? "font-bold" : "" }` }>
					<span>-</span>
					{ p.avatar && <Avatar size="sm" src={ p.avatar } className="transition-transform h-[25px] w-[25px]"/> }
					{ p.name }
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

	const { state: startState, post: start } = useRest("/game/start")
	const { state: updateState, error, post: update } = useRest("/game/settings", {
		onError: onOpen
	})

	const disabled = !player.master || updateState === "loading"

	const [ amount, setAmount ] = useState<number>(game.settings.werewolfAmount)
	const [ roles, setRoles ] = useState(game.settings.roles)

	const [ isPublic, setPublic ] = useState(game.settings.isPublic)
	const [ deadRoles, setDeadRoles ] = useState(game.settings.revealDeadRoles)
	const [ deadSpectators, setDeadSpectators ] = useState(game.settings.deadSpectators)
	const [ loverRoles, setLoverRoles ] = useState(game.settings.revealLoverRoles)
	const [ muteMembers, setMuteMember ] = useState(game.settings.muteMembers)

	function updateSettings(werewolfAmount?: number) {
		update({
			data: {
				werewolfAmount: werewolfAmount || amount,
				roles: roles,
				isPublic: isPublic,
				revealDeadRoles: deadRoles,
				deadSpectators: deadSpectators,
				revealLoverRoles: loverRoles,
				muteMembers: muteMembers
			}
		})
	}

	useEffect(() => {
		if(roles.toString() == game.settings.roles.toString() && isPublic === game.settings.isPublic && deadRoles === game.settings.revealDeadRoles && deadSpectators === game.settings.deadSpectators && loverRoles === game.settings.revealLoverRoles && muteMembers === game.settings.muteMembers) return
		updateSettings()
	}, [ roles, isPublic, deadRoles, deadSpectators, loverRoles, muteMembers ])

	useEffect(() => {
		setAmount(game.settings.werewolfAmount)
		setRoles(game.settings.roles)
		setPublic(game.settings.isPublic)
		setDeadRoles(game.settings.revealDeadRoles)
		setDeadSpectators(game.settings.deadSpectators)
		setLoverRoles(game.settings.revealLoverRoles)
		setMuteMember(game.settings.muteMembers)
	}, [ game.settings ])

	return (
		<>
			<Card shadow="sm" className="md:w-1/2 select-none" isDisabled={ updateState === "loading" }>
				<CardHeader className="text-2xl font-black flex justify-center">Einstellungen</CardHeader>
				<Divider/>
				<CardBody className="flex flex-col justify-between gap-4">
					<div className="flex flex-col gap-5 [&_h3]:font-bold">
						<div>
							<h3 className="flex flex-row justify-between">Werslime Anzahl <span>{ amount }</span></h3>
							<Slider
								aria-label="Werwolf Anzahl" className="font-bold [&_*]:!text-md" size="md"
								minValue={ 1 } maxValue={ 10 } step={ 1 } showSteps
								value={ amount }
								onChange={ value => setAmount(value as number) }
								onChangeEnd={ value => updateSettings(value as number) }
								isDisabled={ disabled }
							/>
						</div>

						<div className="flex flex-col gap-4 justify-between xl:flex-row xl:[&>div]:w-1/2 [&>div]:flex [&>div]:flex-col [&>div]:gap-1">
							<div>
								<h3>Rollen</h3>
								<CheckboxGroup
									aria-label="Spezial-Rollen" size="md" className="[&>div]:gap-1"
									value={ roles }
									onValueChange={ values => setRoles(values as Role[]) }
									isDisabled={ disabled }
								>
									{ [ ...roleDescriptions.entries() ].map(([ role, description ]) =>
										<Tooltip key={ role } shouldFlip={ false } placement="right" content={ description }>
											<div className="w-fit">
												<Checkbox color={ teamColors.get(roleTeams.get(role)!) } value={ role }>{ roleNames.get(role) }</Checkbox>
											</div>
										</Tooltip>
									) }
								</CheckboxGroup>
							</div>

							<div>
								<h3>Sonstiges</h3>
								<Tooltip shouldFlip={ false } placement="right" content={ <span className="max-w-[400px]">Die Runde wird in 'Öffentliche Runden' angezeigt und kann ohne Link betreten werden</span> }>
									<div className="w-fit">
										<Checkbox isDisabled={ disabled } isSelected={ isPublic } onValueChange={ setPublic }>Öffentlich</Checkbox>
									</div>
								</Tooltip>
								<Tooltip shouldFlip={ false } placement="right" content={ <>Rollen von Toten werden für alle angezeigt</> }>
									<div className="w-fit">
										<Checkbox isDisabled={ disabled } isSelected={ deadRoles } onValueChange={ setDeadRoles }>Tote Rollen anzeigen</Checkbox>
									</div>
								</Tooltip>
								<Tooltip shouldFlip={ false } placement="right" content={ <>Tote können die Rollen Aller sehen</> }>
									<div className="w-fit">
										<Checkbox isDisabled={ disabled } isSelected={ deadSpectators } onValueChange={ setDeadSpectators }>Tote Zuschauer</Checkbox>
									</div>
								</Tooltip>

								<Tooltip shouldFlip={ false } placement="right" content={ <>Die Verliebten sehen gegenseitig ihre Rollen</> }>
									<div className="w-fit">
										<Checkbox isDisabled={ disabled } isSelected={ loverRoles } onValueChange={ setLoverRoles }>Zeige Verliebten Rolle</Checkbox>
									</div>
								</Tooltip>

								{ game.discord &&
									<Tooltip shouldFlip={ false } placement="right" content={ <>Mitglieder werden automatisch gemutet, wenn sie nicht sprechen dürfen</> }>
										<div className="w-fit">
											<Checkbox isDisabled={ disabled } isSelected={ muteMembers } onValueChange={ setMuteMember }>Mitglieder muten</Checkbox>
										</div>
									</Tooltip>
								}
							</div>
						</div>
					</div>

					{ player.master && <Button className="font-bold min-h-[28px] flex-shrink-0" isDisabled={ amount >= game.players.length / 2.0 } isLoading={ startState === "loading" } spinner={ <Spinner/> } onPress={ () => start() }>Runde Starten</Button> }
				</CardBody>
			</Card>
			<ErrorModal error={ error! } isOpen={ isOpen } onOpenChange={ onOpenChange }/>
		</>
	)
}