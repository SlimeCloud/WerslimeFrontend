import { Button, Card, CardBody, CardHeader, Divider, Input, ScrollShadow, useDisclosure } from "@nextui-org/react";
import { FormEvent, useMemo, useState } from "react";
import { useRest } from "../hooks/useRest.ts";
import { useNavigate } from "react-router";
import { useToken } from "../hooks/useToken.ts";
import Spinner from "../components/Spinner.tsx";
import ErrorModal from "../components/ErrorModal.tsx";
import { useName } from "../hooks/useName.ts"

export default function HomePage() {
	return (
		<>
			<CreateGame/>
			<JoinGame/>
		</>
	)
}

function CreateGame() {
	const navigate = useNavigate()
	const { setToken } = useToken()

	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const { state, error, post } = useRest<{ token: string, game: string }>("/games", {
		onError: onOpen,
		onSuccess: ({ token, game }) => {
			setToken(token)
			navigate(`/game/${ game }`)
		}
	})

	const { name, setName } = useName()
	const invalid = useMemo(() => !/^[a-zA-Z0-9_-]{3,16}$/.test(name), [ name ])

	function createGame(e?: FormEvent) {
		e?.preventDefault()
		if(invalid) return

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
							<Input
								label="Name" placeholder="Gib deinen Namen ein"
								value={ name }
								onValueChange={ setName }
								maxLength={ 16 }
							/>
							<Button isDisabled={ invalid } className="h-[45px]" color="primary" spinner={ <Spinner/> } onPress={ () => createGame() } isLoading={ state === "loading" }>Runde Erstellen</Button>
						</form>

						<Card className="text-xl bg-default-100 tracking-wide h-full hidden md:flex" shadow="none">
							<CardHeader className="font-bold">Informationen</CardHeader>
							<CardBody>
								Erstelle eine eigene Runde und lade andere Mitspieler ein. In dieser Runde kannst du eigene Einstellungen vornehmen und Teilnehmer verwalten.
							</CardBody>
						</Card>
					</ScrollShadow>
				</CardBody>
			</Card>
			<ErrorModal error={ error! } isOpen={ isOpen } onOpenChange={ onOpenChange }/>
		</>
	)
}

function JoinGame() {
	const navigate = useNavigate()

	const [ id, setId ] = useState("");
	const invalid = useMemo(() => !/^[a-zA-Z0-9]{11}$/i.test(id), [ id ]);

	function joinGame(e?: FormEvent) {
		e?.preventDefault()
		if(invalid) return

		navigate(`/game/${ id }`)
	}

	return (
		<>
			<Card shadow="sm" className="flex-grow md:w-1/2">
				<CardHeader className="text-2xl font-black flex justify-center">Spiel Beitreten</CardHeader>
				<Divider/>
				<CardBody>
					<ScrollShadow className="gap-10 flex flex-col px-5 py-10">
						<form className="gap-5 flex flex-col" onSubmit={ joinGame }>
							<Input
								label="Spiel-ID" placeholder="Gib die ID der Runde ein"
								value={ id }
								onValueChange={ setId }
							/>
							<Button isDisabled={ invalid } className="h-[45px]" color="primary" onPress={ () => joinGame() }>Runde Beitreten</Button>
						</form>

						<Card className="text-xl bg-default-100 tracking-wide hidden md:flex" shadow="none">
							<CardHeader className="font-bold">Informationen</CardHeader>
							<CardBody>
								Tritt einer bestehenden Runde bei. Die Regeln werden vom Ersteller der Runde kontrolliert, dieser hat jedoch keine Vorteile im Spiel.
							</CardBody>
						</Card>
					</ScrollShadow>
				</CardBody>
			</Card>
		</>
	)
}