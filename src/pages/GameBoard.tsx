import mayor from "../assets/modifier/mayor.png"
import victim from "../assets/modifier/victim.png"

import heal from "../assets/action/heal.png"
import poison from "../assets/action/poison.png"
import shoot from "../assets/action/shoot.png"
import view from "../assets/action/view.png"

import { useGameState } from "../hooks/useGameState.ts";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Image, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure } from "@nextui-org/react"
import { Player } from "../types/Player.ts"
import { Role, roleImages, roleNames } from "../types/Role.ts"
import { GameState } from "../types/GameState.ts"
import EventModal from "../components/EventModal.tsx"
import { Request, useRest } from "../hooks/useRest.ts"
import { ReactNode, useEffect } from "react"
import ErrorModal from "../components/ErrorModal.tsx"
import { useNavigate } from "react-router"
import { useToken } from "../hooks/useToken.ts"
import { useServerValue } from "../hooks/useServerValue.ts"

export default function GameBoard() {
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const { game, player } = useGameState()!

	const navigate = useNavigate()
	const { setToken } = useToken()

	const { post: next } = useRest("/game/next")
	const { post: action } = useRest("/game/action")
	const { post: reset } = useRest("/game/reset")

	const winner = useServerValue<{ winner: Role } | undefined>("END", undefined, onOpen)

	return (
		<>
			<div className="fixed top-[70px] left-0 text-xl w-full flex gap-2 justify-center">
				Aktuell an der Reihe: <Image width="30px" alt={ roleNames.get(game.current) } src={ roleImages.get(game.current) }/> <b>{ roleNames.get(game.current) }</b>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-10 w-full mb-auto">
				{ game.players.map(p => <PlayerCard key={ p.id } state={ { game, player } } player={ p }/>) }
			</div>

			{ (player.role === "WITCH" && game.current === player.role) && <Button className="fixed bottom-[60px] left-5" onPress={ () => action({ data: { action: "SKIP" } }) }>Überspringen</Button> }
			{ player.master && <Button color={ game.interacted >= game.total ? "primary" : "warning" } className="fixed bottom-[60px] block right-5" onPress={ () => next() }>
				Weiter (<b>{ game.interacted } / { game.total }</b>)
			</Button> }

			<Modal isOpen={ isOpen } onOpenChange={ onOpenChange }>
				<ModalContent>
					<ModalHeader>Spiel Beendet</ModalHeader>
					<Divider/>
					<ModalBody className="p-5 flex flex-row">
						<Image width="25px" alt={ roleNames.get(winner?.winner || "VILLAGER") } src={ roleImages.get(winner?.winner || "VILLAGER") }/>
						{ winner?.winner === "VILLAGER" ? <><b>Das Dorf</b> hat</> : <><b>Die Werwölfe</b> haben</> } die Runde gewonnen!
					</ModalBody>
					<Divider/>
					<ModalFooter>
						<Button size="sm" color="warning" onPress={ () => {
							if(player.master) reset()
							else {
								navigate("/")
								setToken("")
							}
						} }>{ player.master ? "Runde zurücksetzten" : "Runde verlassen" }</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<EventModal event="KILL">
				<ModalHeader>Du bist gestorben</ModalHeader>
				<Divider/>
				<ModalBody className="p-5">Du bist gestorben. Du kannst das Spielgeschehen weiter beobachten und in der nächsten Runde wieder mitspielen!</ModalBody>
			</EventModal>
		</>
	)
}

function PlayerCard({ state, player }: { state: GameState, player: Player }) {
	const target = state.game.interactions && state.game.interactions[player.id as never] as string
	const targetName = state.game.players.find(p => p.id === target)?.name

	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const { error, post } = useRest("/game/action", {
		onError: () => onOpen()
	})

	const action = useInteractions(state, player, post)

	return (
		<>
			<Card
				className={ `h-[250px] border-2 border-transparent ${ player.id === state.player.id ? "border-primary" : "" } ${ player.id === state.game.victim ? "border-danger" : "" } ${ ((state.game.current === "VILLAGER" || state.game.current === state.player.role) && !!action) ? "hover:scale-[1.05]" : "" }` }
				isDisabled={ !player.alive }
				isPressable={ ((state.game.current === "VILLAGER" || state.game.current === state.player.role) && !!action) }
				onPress={ () => action?.execute() }
			>
				<CardHeader className="font-bold flex justify-between">{ player.name }
					<span className="flex gap-2">
						{ player.mayor && <Tooltip content="Bürgermeister"><Image alt="Bürgermeister" src={ mayor } width="25px"/></Tooltip> }
						{ player.id === state.game.victim && <Tooltip content="Opfer der Nacht"><Image alt="Opfer der Nacht" src={ victim } width="25px"/></Tooltip> }
					</span>
				</CardHeader>
				<Divider/>
				<CardBody className="overflow-hidden">
					<Tooltip content={ roleNames.get(player.role || (player.mayor ? "MAYOR" : "UNKNOWN")) }>
						<Image
							isBlurred isZoomed
							classNames={ { wrapper: "m-auto" } } className="object-cover h-[150px] hover:scale-[1.2]"
							alt={ roleNames.get(player.role || (player.mayor ? "MAYOR" : "UNKNOWN")) }
							src={ roleImages.get(player.role || (player.mayor ? "MAYOR" : "UNKNOWN")) }
						/>
					</Tooltip>
				</CardBody>
				<Divider/>
				<CardFooter className="h-[26px]">
					{ targetName && (`${ state.game.current === "WEREWOLF" ? "☠️" : "🗳️" } ${ targetName }`) }
				</CardFooter>
			</Card>

			<ErrorModal error={ error! } isOpen={ isOpen } onOpenChange={ onOpenChange }/>

			{ action?.node }
		</>
	)
}

interface Action {
	node: ReactNode,
	execute: () => void
}

function useInteractions(state: GameState, target: Player, action: (req?: Request) => void): Action | undefined {
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()

	useEffect(() => {
		onClose()
	}, [ state.game.interactions ])

	switch(state.game.current) {
		case "VILLAGER":
		case "WEREWOLF":
			if(!state.player.alive || !target.alive || target.role === state.player.role) return
			else return {
				node: undefined,
				execute: () => action({ data: { target: target.id } })
			}
		case "WITCH":
			if(!state.player.alive || !target.alive || (target.id === state.player.id && target.id !== state.game.victim)) return
			if(target.id === state.game.victim && !array(state.game.roleMeta)?.includes("HEAL")) return
			if(target.id !== state.game.victim && !array(state.game.roleMeta)?.includes("POISON")) return
			if(state.game.interacted) return

			return {
				node: <Modal isOpen={ isOpen } onOpenChange={ onOpenChange } size="sm" placement="center">
					<ModalContent>
						<ModalHeader className="flex justify-center">{ target.id === state.game.victim ? "Heilen" : "Vergiften" }</ModalHeader>
						<ModalBody>
							<div className="cursor-pointer flex justify-center" onClick={ () => {
								if(target.id === state.game.victim) action({ data: { action: "HEAL" } })
								else action({ data: { target: target.id, action: "POISON" } })
							} }>
								<Image
									alt={ target.id === state.game.victim ? "Heilen" : "Vergiften" }
									src={ target.id === state.game.victim ? heal : poison }
								/>
							</div>
						</ModalBody>
					</ModalContent>
				</Modal>,
				execute: onOpen
			}
		case "SEER":
			if(!state.player.alive || !target.alive || target.id === state.player.id) return
			if(array(state.game.roleMeta)?.includes(target.id)) return
			if(state.game.interacted) return

			return {
				node: <Modal isOpen={ isOpen } onOpenChange={ onOpenChange } size="sm" placement="center">
					<ModalContent>
						<ModalHeader className="flex justify-center">Rolle Ansehen</ModalHeader>
						<ModalBody>
							<div className="cursor-pointer flex justify-center" onClick={ () => action({ data: { target: target.id } }) }>
								<Image
									width="300px"
									alt="Rolle Ansehen" isZoomed isBlurred
									src={ view }
								/>
							</div>
						</ModalBody>
					</ModalContent>
				</Modal>,
				execute: onOpen
			}
		case "HUNTER":
			if(!target.alive) return
			if(state.game.interacted) return

			return {
				node: <Modal isOpen={ isOpen } onOpenChange={ onOpenChange } size="sm" placement="center">
					<ModalContent>
						<ModalHeader className="flex justify-center">Erschießen</ModalHeader>
						<ModalBody>
							<div className="cursor-pointer flex justify-center" onClick={ () => action({ data: { target: target.id } }) }>
								<Image
									width="300px"
									alt="Rolle Ansehen" isZoomed isBlurred
									src={ shoot }
								/>
							</div>
						</ModalBody>
					</ModalContent>
				</Modal>,
				execute: onOpen
			}
	}
}

function array<T>(value?: object): T[] | undefined {
	return value && Array.isArray(value) ? value : undefined
}