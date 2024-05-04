import mayor from "../assets/modifier/mayor.png"
import victim from "../assets/modifier/victim.png"

import { useGameState } from "../hooks/useGameState.ts";
import { Avatar, Button, Card, CardBody, CardFooter, CardHeader, CircularProgress, Divider, Image, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure } from "@nextui-org/react"
import { Player } from "../types/Player.ts"
import { isRoleActive, Role, roleImages, roleNames, teamColors, teamNames } from "../types/Role.ts"
import EventModal from "../components/EventModal.tsx"
import { Request, useRest } from "../hooks/useRest.ts"
import { Suspense, useContext, useEffect, useState } from "react"
import ErrorModal from "../components/ErrorModal.tsx"
import { useNavigate } from "react-router"
import { useToken } from "../hooks/useToken.ts"
import { useServerValue } from "../hooks/useServerValue.ts"
import Spinner from "../components/Spinner.tsx"
import { Heart } from "lucide-react"
import { Action, TargetContext } from "./actions/Action.ts"
import useArmorAction from "./actions/AmorAction.tsx"
import useWitchAction from "./actions/WitchAction.tsx"
import useSeerAction from "./actions/SeerAction.tsx"
import useHunterAction from "./actions/HunterAction.tsx"
import useAuraSeerAction from "./actions/AuraSeerAction.tsx"
import useVoteAction from "./actions/VoteAction.tsx"
import ConditionalParent from "../components/ConditionalParent.tsx"

export default function GameBoard() {
	const { game, player } = useGameState()!
	const { isOpen, onOpen, onOpenChange } = useDisclosure()

	const { patch: next } = useRest("/games/@me/session", {
		onError: () => onOpen()
	})
	const { error, post } = useRest("/games/@me/action", {
		onError: () => onOpen()
	})

	const targets = useState<string[]>([])

	useEffect(() => {
		targets[1]([])
	}, [ game.current ])

	return (
		<TargetContext.Provider value={ targets }>
			<div className="fixed top-[70px] left-0 text-xl w-full flex gap-2 justify-center z-10">
				Aktuell an der Reihe: <Image width="30px" alt={ roleNames.get(game.current) } src={ roleImages.get(game.current) }/> <b>{ roleNames.get(game.current) }</b>
			</div>

			<Board post={ post }/>

			{ player.master &&
				<Button color={ game.valid ? "primary" : "warning" } className="fixed bottom-[60px] block right-5 z-20" onPress={ () => next() }>
					Weiter (<b>{ game.interacted } / { game.total }</b>)
				</Button>
			}

			<ErrorModal error={ error! } isOpen={ isOpen } onOpenChange={ onOpenChange }/>
			<EndModal/>

			<EventModal event="KILL">
				<ModalHeader className="py-3">Du bist gestorben</ModalHeader>
				<Divider/>
				<ModalBody className="p-5">Du bist gestorben. Du kannst das Spielgeschehen weiter beobachten und in der nächsten Runde wieder mitspielen!</ModalBody>
			</EventModal>
		</TargetContext.Provider>
	)
}

function Board({ post }: { post: (req?: Request<unknown>) => void }) {
	const { game, player } = useGameState()!

	const action = useInteractions(post)

	return (
		<>
			<div className={ `grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-10 w-full mb-auto rounded-[20px] p-5 ${ (isRoleActive(player, game.current) && !Object.keys(game.interactions || {}).includes(player.id) && player.alive) ? "animate-border-pulse" : "" }` }>
				{ game.players.map(p => <PlayerCard key={ p.id } p={ p } action={ action?.execute(p) }/>) }
			</div>

			{ isRoleActive(player, game.current) && <Suspense fallback={ <CircularProgress className="m-auto" aria-label="Lade Aktion"/> }>{ action?.node }</Suspense> }
		</>
	)
}

function EndModal() {
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const { delete: reset } = useRest("/games/@me/session")

	const { player } = useGameState()!

	const navigate = useNavigate()
	const { setToken } = useToken()

	const [ waiting, setWaiting ] = useState(false)
	const winner = useServerValue<{ winner: Role } | undefined>("END", undefined, () => {
		onOpen()
		setWaiting(false)
	})

	return (
		<Modal isOpen={ isOpen } onOpenChange={ onOpenChange } isDismissable={ false } hideCloseButton={ true }>
			<ModalContent>
				<ModalHeader className="py-3">Spiel Beendet</ModalHeader>
				<Divider/>
				<ModalBody className="p-5 flex flex-row">
					<Image width="25px" alt="Gewinner-Icon" src={ roleImages.get(winner?.winner || "VILLAGER") }/>
					{
						winner?.winner === "WEREWOLF" ? <><b>Die Werwölfe</b> haben</> :
						winner?.winner === "JESTER" ? <><b>Der Narr</b> hat</> :
						winner?.winner === "LOVER" ? <><b>Die Verliebten</b> hat</> :
						<><b>Das Dorf</b> hat</>
					} {' '} die Runde gewonnen!
				</ModalBody>
				<Divider/>
				<ModalFooter className="px-4 py-2">
					<Button size="sm" onPress={ () => {
						if(player.master) reset()
						else {
							navigate("/")
							setToken("")
						}
					} }>{ player.master ? "Runde zurücksetzten" : "Runde verlassen" }</Button>
					{ !player.master && <Button color="primary" size="sm" spinner={ <Spinner/> } isLoading={ waiting } onPress={ () => setWaiting(true) }>{ waiting ? "Warte auf Spiel-Leiter…" : "Auf nächste Runde Warten" }</Button> }
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

function PlayerCard({ p, action }: { p: Player, action?: () => void }) {
	const { game, player } = useGameState()!

	const target = game.interactions && game.interactions[p.id as never] as string
	const targetName = game.players.find(p => p.id === target)?.name

	const [ targets ] = useContext(TargetContext)!
	const votes = game.interactions ? Object.entries(game.interactions).filter(([, target]) => target === p.id).length : 0
	const tooltip = p.id === game.target ? "Aktuell Gewählt" :
		targets.includes(p.id) ? "Von dir Ausgewählt" :
		p.id === game.victim ? "Opfer der Nacht" :
		p.team ? teamNames.get(p.team) :
		undefined

	return (
		<ConditionalParent condition={ !!tooltip } parent={ children => <Tooltip content={ tooltip } >{ children }</Tooltip> }>
			<Card
				className={ `h-[250px] border-2 border-transparent select-none ${ p.id === player.id ? "border-" + teamColors.get(p.team) : "" } ${ p.id === game.victim ? "border-danger" : "" } ${ targets.includes(p.id) ? "border-[#3483eb]" : "" } ${ p.id === game.target ? "border-[gold]" : "" }  ${ (isRoleActive(player, game.current) && !!action) ? "hover:scale-[1.05]" : "" }` }
				isDisabled={ !p.alive } isPressable
				onPress={ () => {
					(isRoleActive(player, game.current) && !!action) && action()
				} }
			>
				<CardHeader className={ `font-bold flex justify-between text-${ p.team ? teamColors.get(p.team) : "" }` }>
				<span className="flex gap-2 items-center">
					{ p.avatar && <Avatar size="sm" src={ p.avatar } className="transition-transform h-[25px] w-[25px]"/> }
					{ p.name }
					{ p.lover && <Heart width="15px" color="hotpink" fill="hotpink"/> }
				</span>
					<span className="flex gap-2 absolute right-2">
					{ p.mayor && <Tooltip content="Bürgermeister"><Image alt="Bürgermeister" src={ mayor } width="25px"/></Tooltip> }
						{ p.id === game.victim && <Tooltip content="Opfer der Nacht"><Image alt="Opfer der Nacht" src={ victim } width="25px"/></Tooltip> }
				</span>
				</CardHeader>
				<Divider/>
				<CardBody className="overflow-hidden">
					<Tooltip content={ roleNames.get(p.role || (p.mayor ? "MAYOR" : "UNKNOWN")) } closeDelay={ 0 }>
						<Image
							isBlurred isZoomed
							classNames={ { wrapper: "m-auto" } } className="object-cover h-[150px] hover:scale-[1.2]"
							alt={ roleNames.get(p.role || (p.mayor ? "MAYOR" : "UNKNOWN")) }
							src={ roleImages.get(p.role || (p.mayor ? "MAYOR" : "UNKNOWN")) }
						/>
					</Tooltip>
				</CardBody>
				<Divider/>
				<CardFooter className="h-[28px] overflow-hidden whitespace-nowrap text-sm py-1">
					<Tooltip content={ `${ p.name } hat für ${ targetName } abgestimmt` }>{ targetName && (`${ game.current === "WEREWOLF" ? "☠️" : "🗳️" } ${ targetName }`) }</Tooltip>
					<Tooltip content={ `${ p.name } hat ${ votes } Stimmen` }>{ !!votes && <span className="absolute right-2 font-bold">({ votes })</span> }</Tooltip>
				</CardFooter>
			</Card>
		</ConditionalParent>
	)
}

function useInteractions(action: (req?: Request<unknown>) => void): Action | undefined {
	const { game } = useGameState()!

	const voteAction = useVoteAction(action)
	const armorAction = useArmorAction(action)
	const witchAction = useWitchAction(action)
	const auraSeerAction = useAuraSeerAction(action)
	const seerAction = useSeerAction(action)
	const hunterAction = useHunterAction(action)

	switch(game.current) {
		case "VILLAGER":
		case "VILLAGER_ELECT":
		case "WEREWOLF": return voteAction

		case "AMOR": return armorAction
		case "WITCH": return witchAction
		case "AURA_SEER": return auraSeerAction
		case "SEER": return seerAction
		case "HUNTER": return hunterAction
	}
}