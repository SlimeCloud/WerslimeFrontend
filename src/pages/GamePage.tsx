import { GameStateContext, useGameState } from "../hooks/useGameState.ts";
import { useNavigate, useParams } from "react-router";
import GameBoard from "./GameBoard.tsx";
import GameLobby from "./GameLobby.tsx";
import { Button, Card, CardBody, CardHeader, Divider, Input, Modal, ModalBody, ModalContent, ModalHeader, ScrollShadow, useDisclosure } from "@nextui-org/react";
import { useRest } from "../hooks/useRest.ts";
import { FormEvent, ReactNode, useMemo, useState } from "react";
import { useToken } from "../hooks/useToken.ts";
import Spinner from "../components/Spinner.tsx";
import { useServerValue } from "../hooks/useServerValue.ts";
import { GameState } from "../types/GameState.ts";
import EventProvider from "../components/EventProvider.tsx";
import { useEvent } from "../hooks/useEvent.ts";

export default function GamePage() {
	const state = useGameState()

	const params = useParams()
	const id = params.id

	return (
		<>
			{ (!state?.game || state.game.id !== id)
				? <JoinGame id={ id! }/>
				: <EventProvider route="/events"><Game defaultValue={ state }/></EventProvider>
			}
		</>
	)
}

function Game({ defaultValue }: { defaultValue: GameState }) {
	const navigate = useNavigate();
	const { setToken } = useToken()

	const state = useServerValue("UPDATE", defaultValue)

	return (
		<>
			<GameStateContext.Provider value={ state }>
				{ state.game.started
					? <GameBoard/>
					: <GameLobby/>
				}
			</GameStateContext.Provider>

			<EventModal event="KICK" onClose={ () => setToken("") }>
				<ModalHeader className="text-danger">Kick</ModalHeader>
				<Divider/>
				<ModalBody className="p-5">Du wurdest vom Spiel-Leiter aus der Runde geworfen!</ModalBody>
			</EventModal>

			<EventModal event="CLOSE" onClose={ () => {
				setToken("")
				navigate("/")
			} }>
				<ModalHeader className="text-danger">Spiel Beendet</ModalHeader>
				<Divider/>
				<ModalBody className="p-5">Diese Runde wurde beendet. Erstelle selbst eine neue Runde oder tritt einer andren bei, um weiter zu spielen!</ModalBody>
			</EventModal>
		</>
	)
}

function EventModal({ event, onClose, children }: { event: string, onClose?: () => void, children: ReactNode }) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	useEvent(event, onOpen)

	return (
		<Modal isOpen={ isOpen } onOpenChange={ onOpenChange } onClose={ onClose }>
			<ModalContent>
				{ children }
			</ModalContent>
		</Modal>
	)
}

function JoinGame({ id }: { id: string }) {
	const { setToken } = useToken()

	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const { state, error, post } = useRest<{ token: string }>("/game/join", {
		onError: onOpen,
		onSuccess: ({ token }) => setToken(token)
	})

	const [ name, setName ] = useState("");
	const invalid = useMemo(() => !/^[A-Za-z0-9_\- ]{4,}$/.test(name), [ name ]);

	function joinGame(e?: FormEvent) {
		e?.preventDefault()

		post({
			path: `?id=${ id }`,
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
							/>
							<Button isDisabled={ invalid } className="h-[45px]" color="primary" spinner={ <Spinner/> } onPress={ () => joinGame() } isLoading={ state === "loading" }>Beitreten</Button>
						</form>
					</ScrollShadow>
				</CardBody>
			</Card>
			<Modal isOpen={ isOpen } onOpenChange={ onOpenChange }>
				<ModalContent>
					<ModalHeader className="text-danger">Fehler</ModalHeader>
					<ModalBody>
						{ error?.type }
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	)
}