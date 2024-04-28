import { GameStateContext, useGameState, useGameStateRequest } from "../hooks/useGameState.ts";
import { useNavigate, useParams } from "react-router";
import GameBoard from "./GameBoard.tsx";
import GameLobby from "./GameLobby.tsx";
import { Button, Card, CardBody, CardHeader, CircularProgress, Divider, Input, ModalBody, ModalHeader, ScrollShadow, useDisclosure } from "@nextui-org/react";
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

async function playSound(sound: Sound) {
	const path = await import(`../assets/sounds/${ sound.sound.toLocaleLowerCase() }${ sound.variant >= 0 ? `_${ sound.variant }` : "" }.mp3`)
	const audio = new Audio(path.default)
	audio.volume = sound.volume
}

function GameDisplay({ defaultValue }: { defaultValue: GameState }) {
	const navigate = useNavigate();
	const { setToken } = useToken()

	const { set } = useGameStateRequest()!
	const state = useServerValue("UPDATE", defaultValue)

	useEvent<Sound>("SOUND", sound => playSound(sound))

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
				<ModalHeader className="text-danger">Kick</ModalHeader>
				<Divider/>
				<ModalBody className="p-5">Du wurdest vom Spiel-Leiter aus der Runde geworfen!</ModalBody>
			</EventModal>

			<EventModal event="CLOSE" onClose={ () => {
				setToken("")
				navigate("/")
			} }>
				<ModalHeader className="text-warning">Runde Geschlossen</ModalHeader>
				<Divider/>
				<ModalBody className="p-5">Diese Runde wurde beendet. Erstelle selbst eine neue Runde oder tritt einer andren bei, um weiter zu spielen!</ModalBody>
			</EventModal>
		</>
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
	const { state, error, post } = useRest<{ token: string }>("/game/join", {
		onError: onOpen,
		onSuccess: ({ token }) => setToken(token)
	})

	const { name, setName } = useName()
	const invalid = useMemo(() => !/^[a-zA-Z0-9_-]{3,16}$/.test(name), [ name ])

	function joinGame(e?: FormEvent) {
		e?.preventDefault()
		if(invalid) return

		post({
			path: `?id=${ game.id }`,
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
		window.location.href = `https://discord.com/oauth2/authorize?client_id=${ import.meta.env._CLIENT_ID }&scope=identify&response_type=code&redirect_uri=${ import.meta.env._BASE }/oauth2&state=${ game.id }`
	}, [])

	return <CircularProgress className="m-auto"/>
}