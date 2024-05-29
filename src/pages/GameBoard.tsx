import mayor from "../assets/modifier/mayor.png"
import lover from "../assets/modifier/lover.png"
import victim from "../assets/modifier/victim.png"
import vote from "../assets/action/vote.png"
import kill from "../assets/action/kill.png"
import anvil from "../assets/action/anvil.png"
import healIcon from "../assets/action/heal.png"
import poisonIcon from "../assets/action/poison.png"
import viewIcon from "../assets/action/view.png"
import shootIcon from "../assets/action/shoot.png"
import markIcon from "../assets/action/mark.png"

import { useGameState } from "../hooks/useGameState.ts";
import { Avatar, Button, Card, CardBody, CardFooter, CardHeader, CircularProgress, Divider, Image, ModalBody, ModalHeader, Tooltip, useDisclosure } from "@nextui-org/react"
import { getEffectiveRole, Player } from "../types/Player.ts"
import { isRoleActive, Role, roleImages, roleNames } from "../types/Role.ts"
import EventModal from "../components/EventModal.tsx"
import { Request, useRest } from "../hooks/useRest.ts"
import { Suspense, useContext, useEffect, useState } from "react"
import ErrorModal from "../components/ErrorModal.tsx"
import { PlayerClickHandler, TargetContext } from "./actions/PlayerClickHandler.ts"
import useSingleSelect from "./actions/useSingleSelect.tsx"
import useMultiSelect from "./actions/useMultiSelect.tsx"
import useMultiAction from "./actions/useMultiAction.tsx"
import array from "../utils/array.ts"
import useSingleAction from "./actions/useSingleAction.tsx"
import { auraColors, auraNames } from "../types/Aura.ts"

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
				<span className="flex flex-row gap-2 mx-auto">Aktuell an der Reihe: <Image width="30px" alt={ roleNames.get(game.current) } src={ roleImages.get(game.current) }/> <b>{ roleNames.get(game.current) }</b></span>
				{ !player.alive && <span className="mx-auto font-bold text-danger flex gap-2"><Image src={ kill } width="30px"/> Du bist tot</span> }
			</div>

			<Board post={ post }/>

			{ player.master &&
				<Button color={ game.valid ? "primary" : "warning" } className="fixed bottom-[60px] block right-5 z-20" onPress={ () => next() }>
					Weiter (<b>{ game.interacted } / { game.total }</b>)
				</Button>
			}

			<ErrorModal error={ error! } isOpen={ isOpen } onOpenChange={ onOpenChange }/>

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
			<div className={ `font-minecraft grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-10 w-full h-full mb-auto rounded-[20px] p-5 ${ (isRoleActive(player, game.current) && !Object.keys(game.interactions || {}).includes(player.id) && player.alive) ? "animate-border-pulse" : "" }` }>
				{ game.players.map(p => <PlayerCard key={ p.id } p={ p } action={ action?.execute(p) }/>) }
			</div>

			{ isRoleActive(player, game.current) && <Suspense fallback={ <CircularProgress className="m-auto" aria-label="Lade Aktion"/> }>{ action?.node }</Suspense> }
		</>
	)
}

function PlayerCard({ p, action }: { p: Player, action?: () => void }) {
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
					<CardHeader className={ `delay-[147ms] ${ !p.role ? "rotate-y-180" : "rotate-y-0" } py-2 ${ p.id === player.id ? "font-bold" : "" } flex justify-between text-${ p.aura ? auraColors.get(p.aura) : "" }` }>
					<span className="flex gap-2 items-center">
						{ p.avatar && <Avatar size="sm" src={ p.avatar } className="transition-transform h-[25px] w-[25px]"/> }
						{ p.name }
						{ p.modifiers.includes("LOVER") && <Tooltip content="Verliebt"><Image alt="Verliebt" src={ lover } width="20px" className="pixel"/></Tooltip> }
					</span>
						<span className="flex gap-2 absolute right-2">
						{ p.modifiers.includes("MAYOR") && <Tooltip content="Bürgermeister"><Image alt="Bürgermeister" src={ mayor } width="25px" className="pixel"/></Tooltip> }
						{ p.id === game.victim && <Tooltip content="Opfer der Nacht"><Image alt="Opfer der Nacht" src={ victim } width="25px" className="pixel"/></Tooltip> }
					</span>
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
						{ !!targetName && <Tooltip content={ <span className="block">{ p.name } hat für <b>{ targetName }</b> abgestimmt</span> }><span className="flex gap-2 items-center">{ game.current === "WEREWOLF" ? <Image src={ kill } width="20px"/> : game.current === "VILLAGER" ? <Image src={ anvil } width="20px"/> : <Image src={ vote } width="20px" className="pixel"/> } { targetName }</span></Tooltip> }
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
	const warlockAction = useMultiAction(action, target => target.alive && player.alive && !target.role, [
		{ id: "VIEW", name: "Rolle Ansehen", image: viewIcon },
		{ id: "MARK", name: "Markieren", image: markIcon }
	])

	const hunterAction = useSingleAction(action, target => target.alive, {
		id: "target", name: "Schießen", image: shootIcon
	})

	switch(game.current) {
		case "VILLAGER":
		case "VILLAGER_ELECT":
		case "WEREWOLF": return voteAction

		case "AMOR": return amorAction
		case "WITCH": return witchAction
		case "AURA_SEER": return auraSeerAction
		case "WARLOCK": return warlockAction
		case "SEER": return seerAction
		case "HUNTER": return hunterAction
	}
}