import styles from "./HomePage.module.css"
import { Button, Card, CardBody, CardHeader, Divider, Input, Modal, ModalBody, ModalContent, ModalHeader, ScrollShadow, useDisclosure } from "@nextui-org/react";
import { FormEvent, useMemo, useState } from "react";
import { useRest } from "../hooks/useRest.ts";
import Spinner from "../components/Spinner.tsx";

export default function HomePage() {
	return (
		<>
			<CreateGame/>
			<JoinGame/>
		</>
	)
}

function CreateGame() {
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const { state, error, post } = useRest("/game", { onError: onOpen })

	const [ name, setName ] = useState("");
	const invalid = useMemo(() => !/^[A-Za-z0-9_\- ]{4,}$/.test(name), [ name ]);

	function createGame(e?: FormEvent) {
		e?.preventDefault()

		post({
			data: {
				masterName: name
			}
		})
	}

	return (
		<>
			<Card shadow="sm" className="flex-grow md:w-1/2">
				<CardHeader className="text-2xl font-black flex justify-center">Spiel Erstellen</CardHeader>
				<Divider/>
				<CardBody>
					<ScrollShadow className="gap-10 flex flex-col px-5 py-10">
						<form className="gap-5 flex flex-col" onSubmit={ createGame }>
							<Input label="Name" placeholder="Gib deinen Namen ein"
							       color="default"
							       value={ name }
							       onValueChange={ setName }
							/>
							<Button isDisabled={ invalid } className="h-[45px]" color="primary" spinner={ <Spinner/> } onPress={ () => createGame() } isLoading={ state === "loading" }>Runde Erstellen</Button>
						</form>

						<Card className={ `text-xl tracking-wide h-full hidden md:flex ${ styles.description }` } shadow="none">
							<CardHeader className="font-bold">Informationen</CardHeader>
							<CardBody>
								Erstelle eine eigene Runde und lade andere Mitspieler ein. In dieser Runde kannst du eigene Einstellungen vornehmen und Teilnehmer verwalten.
							</CardBody>
						</Card>
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

function JoinGame() {
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const { state, error, post } = useRest("/game/join", { onError: onOpen })

	const [ name, setName ] = useState("");
	const invalid = useMemo(() => !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(name), [ name ]);

	function joinGame(e?: FormEvent) {
		e?.preventDefault()
		post({
			data: {
				masterName: name
			}
		})
	}

	return (
		<>
			<Card shadow="sm" className="flex-grow md:w-1/2">
				<CardHeader className="text-2xl font-black flex justify-center">Spiel Beitreten</CardHeader>
				<Divider/>
				<CardBody>
					<ScrollShadow className="gap-10 flex flex-col px-5 py-10">
						<form className="gap-5 flex flex-col" onSubmit={ joinGame }>
							<Input label="Spiel-ID" placeholder="Gib die ID der Runde ein"
							       color="default"
							       value={ name }
							       onValueChange={ setName }
							/>
							<Button isDisabled={ invalid } className="h-[45px]" color="primary" spinner={ <Spinner/> } onPress={ () => joinGame() } isLoading={ state === "loading" }>Runde Beitreten</Button>
						</form>

						<Card className={ `text-xl tracking-wide hidden md:flex ${ styles.description }` } shadow="none">
							<CardHeader className="font-bold">Informationen</CardHeader>
							<CardBody>
								Tritt einer bestehenden Runde bei. Die Regeln werden vom Ersteller der Runde kontrolliert, dieser hat jedoch keine Vorteile im Spiel.
							</CardBody>
						</Card>
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