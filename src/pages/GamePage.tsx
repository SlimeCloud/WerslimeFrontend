import { GameStateContext, useGameState, useGameStateRequest } from "../hooks/useGameState.ts";
import { useNavigate, useParams } from "react-router";
import GameBoard from "./GameBoard.tsx";
import GameLobby from "./GameLobby.tsx";
import { Button, Card, CardBody, CardHeader, CircularProgress, Divider, Image, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ScrollShadow, useDisclosure } from "@nextui-org/react";
import { useRest } from "../hooks/useRest.ts";
import { FormEvent, useEffect, useMemo } from "react";
import { useToken } from "../hooks/useToken.ts";
import Spinner from "../components/Spinner.tsx";
import { useServerValue } from "../hooks/useServerValue.ts";
import { GameState } from "../types/GameState.ts";
import EventProvider from "../components/EventProvider.tsx";
import ErrorModal from "../components/ErrorModal.tsx";
import EventModal from "../components/EventModal.tsx"
import { useName } from "../hooks/useName.ts"
import { Game } from "../types/Game.ts"
import { useEvent } from "../hooks/useEvent.ts"
import { Sound } from "../types/Sound.ts"
import { useVolume } from "../hooks/useVolume.ts"
import { Role, roleImages } from "../types/Role.ts"

export default function GamePage() {
	const state = useGameState()

	const params = useParams()
	const id = params.id

	return (
		<>
			{ (!state?.game || state.game.id !== id)
				? <JoinGame id={ id! }/>
				: <EventProvider route="/events"><GameDisplay defaultValue={ state }/></EventProvider>
			}
		</>
	)
}

async function playSound(sound: Sound, volume: number) {
	const path = await import(`../assets/sounds/${ sound.sound.toLocaleLowerCase() }${ sound.variant >= 0 ? `_${ sound.variant }` : "" }.mp3`)

	const audio = new Audio(path.default)
	audio.volume = sound.volume * volume
	await audio.play()
}

function GameDisplay({ defaultValue }: { defaultValue: GameState }) {
	const navigate = useNavigate();
	const { setToken } = useToken()

	const { set } = useGameStateRequest()!
	const state = useServerValue("UPDATE", defaultValue)

	const { volume } = useVolume()
	useEvent<Sound>("SOUND", sound => playSound(sound, volume / 100))

	useEffect(() => {
		set(state)
	}, [ state ])

	return (
		<>
			<GameStateContext.Provider value={ state }>
				{ state.game.started
					? <GameBoard/>
					: <GameLobby/>
				}
			</GameStateContext.Provider>

			<EventModal event="KICK" onClose={ () => {
				navigate("/")
				setToken("")
			} }>
				<ModalHeader className="py-3 text-danger">Kick</ModalHeader>
				<Divider/>
				<ModalBody className="p-5">Du wurdest vom Spiel-Leiter aus der Runde geworfen!</ModalBody>
			</EventModal>

			<EventModal event="CLOSE" onClose={ () => {
				setToken("")
				navigate("/")
			} }>
				<ModalHeader className="py-3 text-warning">Runde Geschlossen</ModalHeader>
				<Divider/>
				<ModalBody className="p-5">Diese Runde wurde beendet. Erstelle selbst eine neue Runde oder tritt einer andren bei, um weiter zu spielen!</ModalBody>
			</EventModal>

			<EndModal/>
		</>
	)
}

function EndModal() {
	const { game } = useGameState()!

	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
	const { delete: reset } = useRest("/games/@me/session")
	const { delete: leave } = useRest("/@me/game")

	const { player } = useGameState()!

	const navigate = useNavigate()
	const { setToken } = useToken()

	const winner = useServerValue<{ winner: Role } | undefined>("END", undefined, () => onOpen())

	return (
		<Modal isOpen={ isOpen } onOpenChange={ onOpenChange } isDismissable={ !game.started } hideCloseButton={ game.started }>
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
					<Button size="sm" color="warning" onPress={ () => {
						if(player.master) reset()
						else {
							leave()
							setToken("")
							navigate("/")
						}
					} }>{ player.master ? "Runde zurücksetzten" : "Runde verlassen" }</Button>
					<Button size="sm" onPress={ onClose } color="primary">Schließen</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

function JoinGame({ id }: { id: string }) {
	const navigate = useNavigate()

	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const { state, data, error } = useRest<Game>(`/games/${ id }`, {
		auto: true,
		onError: onOpen
	})

	return (
		<>
			{ state === "loading" && <Spinner className="m-auto"/> }
			{ state === "success" && data?.discord
				? <JoinDiscordGame game={ data! }/>
				: <JoinNormalGame game={ data! }/>
			}

			<ErrorModal error={ error! } isOpen={ isOpen } onOpenChange={ onOpenChange } onClose={ () => navigate("/") }/>
		</>
	)
}

function JoinNormalGame({ game }: { game: Game }) {
	const { setToken } = useToken()

	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const { state, error, put: join } = useRest<{ token: string }>("/@me/game", {
		onError: onOpen,
		onSuccess: ({ token }) => setToken(token)
	})

	const { name, setName } = useName()
	const invalid = useMemo(() => !/^[a-zA-Z0-9_-]{3,16}$/.test(name), [ name ])

	function joinGame(e?: FormEvent) {
		e?.preventDefault()
		if(invalid) return

		join({
			path: `/${ game.id }`,
			data: {
				name: name
			}
		})
	}

	return (
		<>
			<Card shadow="sm" className="flex-grow lg:max-w-[75%] xl:max-w-[60%]">
				<CardHeader className="text-2xl font-black flex justify-center">Runde Beitreten</CardHeader>
				<Divider/>
				<CardBody>
					<ScrollShadow className="gap-10 flex flex-col px-5 py-10">
						<form className="gap-5 flex flex-col" onSubmit={ joinGame }>
							<Input
								label="Name" placeholder="Gib deinen Namen ein"
								value={ name }
								onValueChange={ setName }
								maxLength={ 16 }
							/>
							<Button isDisabled={ invalid } className="h-[45px]" color="primary" spinner={ <Spinner/> } onPress={ () => joinGame() } isLoading={ state === "loading" }>Beitreten</Button>
						</form>
					</ScrollShadow>
				</CardBody>
			</Card>
			<ErrorModal error={ error! } isOpen={ isOpen } onOpenChange={ onOpenChange }/>
		</>
	)
}

function JoinDiscordGame({ game }: { game: Game }) {
	useEffect(() => {
		window.location.href = `https://discord.com/oauth2/authorize?client_id=${ import.meta.env._CLIENT_ID }&scope=identify&response_type=code&redirect_uri=${ import.meta.env._URL }/oauth2&state=${ game.id }`
	}, [])

	return <CircularProgress className="m-auto"/>
}