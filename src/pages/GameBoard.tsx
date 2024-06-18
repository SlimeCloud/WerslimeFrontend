import vote from "../assets/icon/vote.png"
import dead from "../assets/icon/dead.png"
import anvil from "../assets/icon/anvil.png"
import shieldIcon from "../assets/action/shield.png"
import healIcon from "../assets/action/heal.png"
import poisonIcon from "../assets/action/poison.png"
import viewIcon from "../assets/action/view.png"
import shootIcon from "../assets/action/shoot.png"
import markIcon from "../assets/action/mark.png"

import { useGameState } from "../hooks/useGameState.ts";
import { Button, Card, CardBody, CardFooter, CardHeader, CircularProgress, Divider, Image, Modal, ModalBody, ModalContent, ModalHeader, Popover, PopoverContent, PopoverTrigger, Tooltip, useDisclosure } from "@nextui-org/react"
import { EMPTY_PLAYER, getEffectiveRole, Player } from "../types/Player.ts"
import { hasChat, isChatActive, isRoleActive, Role, roleImages, roleNames } from "../types/Role.ts"
import EventModal from "../components/EventModal.tsx"
import { Request, useRest } from "../hooks/useRest.ts"
import { ReactNode, Suspense, useContext, useEffect, useState } from "react"
import ErrorModal from "../components/ErrorModal.tsx"
import { PlayerClickHandler, TargetContext } from "./actions/PlayerClickHandler.ts"
import useSingleSelect from "./actions/useSingleSelect.tsx"
import useMultiSelect from "./actions/useMultiSelect.tsx"
import useMultiAction from "./actions/useMultiAction.tsx"
import array from "../utils/array.ts"
import useSingleAction from "./actions/useSingleAction.tsx"
import { auraColors, auraNames } from "../types/Aura.ts"
import PlayerName from "./components/PlayerName.tsx"
import GameProtocol from "./components/GameProtocol.tsx"
import { MessageCircle, ScrollText } from "lucide-react"
import Chat from "./components/Chat.tsx";
import { Message } from "../types/Message.ts";
import { useEvent } from "../hooks/useEvent.ts";

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
			<div className="fixed top-[70px] left-0 text-xl w-full flex flex-col z-10 font-minecraft select-none">
				<span className="mx-auto flex sm:gap-2 flex-col sm:flex-row">Aktuell an der Reihe: <span className="flex gap-2"><Image width="30px" alt={ roleNames.get(game.current) } src={ roleImages.get(game.current) }/> <b>{ roleNames.get(game.current) }</b></span></span>
				{ (!player.alive && !(game.settings.storyMode && player.master)) && <span className="mx-auto font-bold text-danger flex gap-2"><Image src={ dead } width="30px"/> Du bist tot</span> }
			</div>

			<Board post={ post } next={ next }/>

			<ErrorModal error={ error! } isOpen={ isOpen } onOpenChange={ onOpenChange }/>

			<EventModal event="KILL">
				<ModalHeader className="py-3">Du bist gestorben</ModalHeader>
				<Divider/>
				<ModalBody className="p-5">Du bist gestorben. Du kannst das Spielgeschehen weiter beobachten und in der nächsten Runde wieder mitspielen!</ModalBody>
			</EventModal>
		</TargetContext.Provider>
	)
}

function Actions({ confirm, next }: { confirm: ReactNode, next: (req?: Request<unknown>) => void }) {
	const { game, player} = useGameState()!

	const [ messages, setMessages ] = useState<Message[]>([])

	useEvent<Message>("CHAT", message => {
		setMessages(old => {
			const temp = [ ...old, message ]
			if(temp.length > 50) temp.shift()
			return temp
		})
	})

	const protocol = (game.settings.storyMode && player.master) || (!player.alive && game.settings.deadSpectators)
	const chat = game.settings.chat && ((game.settings.storyMode && player.master) || (!player.alive && game.settings.deadSpectators) || (isChatActive(player, game.current) && hasChat(game.current)))

	return (
		<div className="fixed w-screen bottom-[50px] flex justify-between z-20 px-3">
			{ (protocol || chat) && <span className="flex gap-2">
				{ protocol && <Popover>
					<PopoverTrigger><Button isIconOnly><ScrollText/></Button></PopoverTrigger>
					<PopoverContent className="bg-none shadow-none z-5"><GameProtocol game={ game }/></PopoverContent>
				</Popover> }

				{ chat && <Popover>
					<PopoverTrigger><Button isIconOnly><MessageCircle/></Button></PopoverTrigger>
					<PopoverContent className="bg-transparent shadow-none z-5"><Chat messages={ messages }/></PopoverContent>
				</Popover> }
			</span> }

			{ (!(protocol || chat) && !confirm) && <span/> }
			{ confirm }

			{ player.master &&
				<Button color={ game.valid ? "primary" : "warning" } className="block" onPress={ () => next() }>
					Weiter (<b>{ game.interacted } / { game.total }</b>)
				</Button>
			}
		</div>
	)
}

function Board({ post, next }: { post: (req?: Request<unknown>) => void, next: (req?: Request<unknown>) => void }) {
	const { game, player} = useGameState()!
	const action = useInteractions(post)

	return (
		<>
			<div className={ `font-minecraft grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-10 w-full max-h-full mb-auto rounded-[20px] p-5 ${ (isRoleActive(player, game.current) && !Object.keys(game.interactions || {}).includes(player.id) && player.alive) ? "animate-border-pulse" : "" }` }>
				{ game.players.map(p => <PlayerCard key={ p.id } p={ p } action={ action?.execute(p) }/>) }
			</div>

			{ isRoleActive(player, game.current) && <Suspense fallback={ <CircularProgress className="m-auto" aria-label="Lade Aktion"/> }>{ action?.node }</Suspense> }
			{ player.role === "HEALER" && <HealerModal/> }

			<Actions confirm={ isRoleActive(player, game.current) && action?.confirm } next={ next }/>
		</>
	)
}

function HealerModal() {
	const { game } = useGameState()!
	const { isOpen, onOpen, onOpenChange } = useDisclosure()

	useEvent("SHIELD_ATTACK", onOpen)

	return (
		<Modal isOpen={ isOpen } onOpenChange={ onOpenChange }>
			<ModalContent>
				<ModalHeader className="py-3">Schild-Angriff</ModalHeader>
				<Divider/>
				<ModalBody className="flex flex-row flex-wrap gap-x-2 gap-y-1">
					Dein Schützling <PlayerName player={ game.players.find(p => p.modifiers.includes("SHIELD")) || EMPTY_PLAYER } modifier={ false } bold/> wurde von den Werwölfen angegriffen!
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}

function PlayerCard({p, action}: { p: Player, action?: () => void }) {
	const { game, player } = useGameState()!

	const target = game.interactions && game.interactions[p.id as never] as string
	const targetName = game.players.find(p => p.id === target)?.name

	const [ targets ] = useContext(TargetContext)!
	const votes = game.interactions ? Object.entries(game.interactions).filter(([ , target ]) => target === p.id).length : 0
	const tooltip =
		p.id === game.roleMeta as never as string && player.role === "WEREWOLF" ? "Vom Hexenmeister markiert" :
		p.id === game.target ? "Gewinnt die aktuelle Abstimmung" :
		targets.includes(p.id) ? "Von dir Ausgewählt" :
		p.id === game.victim ? "Opfer der Nacht" :
		p.aura ? "Aura: " + auraNames.get(p.aura) :
		undefined

	return (
		<div className={ `perspective h-fit duration-250 ${ (isRoleActive(player, game.current) && !!action) ? "hover:scale-[1.05]" : "" }` }>
			<Tooltip content={ tooltip } classNames={ { content: tooltip ? "block" : "hidden" } }>
				<Card
					className={ `w-full h-[200px] sm:h-[250px] border-2 border-transparent select-none !duration-500 ${ !p.role ? "rotate-y-180" : "rotate-y-0" } ${ p.id === game.victim ? "border-danger" : "" } ${ targets.includes(p.id) ? "border-[#3483eb]" : "" } ${ p.id === game.target || (p.id === game.roleMeta as never as string && player.role === "WEREWOLF") ? "border-[gold]" : "" }` }
					isDisabled={ !p.alive } isPressable disableRipple
					onPress={ () => {
						(isRoleActive(player, game.current) && !!action) && action()
					} }
				>
					<CardHeader className={ `delay-[147ms] ${ !p.role ? "rotate-y-180" : "rotate-y-0" } py-2 flex justify-between text-${ p.aura ? auraColors.get(p.aura) : "" }` }>
						<PlayerName bold={ p.id === player.id } player={ p }/>
					</CardHeader>
					<Divider/>
					<CardBody className={ `delay-[147ms] ${ !p.role ? "rotate-y-180" : "rotate-y-0" } overflow-hidden` }>
						<Tooltip content={ roleNames.get(getEffectiveRole(p)) } closeDelay={ 0 }>
							<Image
								isBlurred isZoomed
								classNames={ { wrapper: "m-auto" } } className="object-cover h-[110px] sm:h-[150px] hover:scale-[1.2]"
								alt={ roleNames.get(getEffectiveRole(p)) }
								src={ roleImages.get(getEffectiveRole(p)) }
							/>
						</Tooltip>

						{ (player.role === "WARLOCK" && p.id === player.id) &&
							<Tooltip content={ <span>Tarnrolle: <b>{ roleNames.get((game.roleMeta as { camouflage: Role }).camouflage) }</b></span> } closeDelay={ 0 }>
								<Image
									isBlurred isZoomed radius="full"
									classNames={ { wrapper: "absolute left-1 top-1" } } className="object-cover h-[50px] hover:scale-[1.2]"
									alt={ roleNames.get((game.roleMeta as { camouflage: Role }).camouflage) }
									src={ roleImages.get((game.roleMeta as { camouflage: Role }).camouflage) }
								/>
							</Tooltip>
						}
					</CardBody>
					<Divider/>
					<CardFooter className={ `delay-[147ms] ${ !p.role ? "rotate-y-180" : "rotate-y-0" } h-[28px] overflow-hidden whitespace-nowrap text-sm py-1` }>
						{ !!targetName && <Tooltip content={ <span className="block">{ p.name } hat für <b>{ targetName }</b> abgestimmt</span> }><span className="flex gap-2 items-center">{ game.current === "WEREWOLF" ? <Image src={ dead } width="20px"/> : game.current === "VILLAGER" ? <Image src={ anvil } width="20px"/> : <Image src={ vote } width="20px" className="pixel"/> } { targetName }</span></Tooltip> }
						{ !!votes && <Tooltip content={ <span className="block">{ p.name } hat <b>{ votes }</b> Stimmen</span> }><span className="absolute right-2 font-bold">({ votes })</span></Tooltip> }
					</CardFooter>
				</Card>
			</Tooltip>
		</div>
	)
}

function useInteractions(action: (req?: Request<unknown>) => void): PlayerClickHandler | undefined {
	const { game, player } = useGameState()!

	const voteAction = useSingleSelect(action, target => target.alive && player.alive)
	const amorAction = useMultiSelect(action, target => target.alive && player.alive, 2)
	const witchAction = useMultiAction(action, target => target.alive && player.alive, [
		{ id: "HEAL", name: "Heilen", image: healIcon, condition: target => target.id === game.victim && array(game.roleMeta)?.includes("HEAL") },
		{ id: "POISON", name: "Vergiften", image: poisonIcon, condition: target => target.id !== game.victim && array(game.roleMeta)?.includes("POISON") }
	])

	const auraSeerAction = useSingleAction(action, target => target.alive && player.alive && !target.aura, {
		id: "target", name: "Aura Erfühlen", image: viewIcon
	})
	const seerAction = useSingleAction(action, target => target.alive && player.alive && !target.role, {
		id: "target", name: "Rolle Ansehen", image: viewIcon
	})
	const warlockAction = useMultiAction(action, target => target.alive && player.alive, [
		{ id: "VIEW", name: "Rolle Ansehen", image: viewIcon, condition: p => !p.role },
		{ id: "MARK", name: "Markieren", image: markIcon, condition: () => game.roleMeta && (game.roleMeta as { targetLimit: number }).targetLimit > 0 }
	])

	const hunterAction = useSingleAction(action, target => target.alive, {
		id: "target", name: "Schießen", image: shootIcon
	})

	const healerAction = useSingleAction(action, target => target.alive, {
		id: "target", name: "Beschützen", image: shieldIcon, condition: p => !p.modifiers.includes("SHIELD") && p.id !== game.roleMeta as never
	})

	switch(game.current) {
		case "VILLAGER":
		case "VILLAGER_ELECT":
		case "WEREWOLF": return voteAction

		case "AMOR": return amorAction
		case "HEALER": return healerAction
		case "WITCH": return witchAction
		case "AURA_SEER": return auraSeerAction
		case "WARLOCK": return warlockAction
		case "SEER": return seerAction
		case "HUNTER": return hunterAction
	}
}