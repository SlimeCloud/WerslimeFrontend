import { RequestState, useRest } from "../hooks/useRest.ts"
import Spinner from "../components/Spinner.tsx"
import ErrorModal from "../components/ErrorModal.tsx"
import { Button, Card, CardBody, CardHeader, Checkbox, CheckboxGroup, Divider, ScrollShadow, Skeleton, useDisclosure } from "@nextui-org/react"
import { Game } from "../types/Game.ts"
import { RefreshCw } from "lucide-react"
import { roleDescriptions, roleNames } from "../types/Role.ts"
import { Link } from "react-router-dom"
import SettingsDisplay from "./components/SettingsDisplay.tsx"

export default function GameListPage() {
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const { state, data, error, get } = useRest<Game[]>("/games", {
		auto: true,
		delay: 0.5,
		onError: onOpen
	})

	return (
		<Card className="flex-grow lg:max-w-[75%]" shadow="sm">
			<CardHeader className="text-2xl font-black flex justify-center">
				Öffentliche Runden
				<Button className="absolute right-5" isLoading={ state === "loading" } spinner={ <Spinner/> } onPress={ () => get() } isIconOnly={ true }><RefreshCw/></Button>
			</CardHeader>
			<Divider/>
			<CardBody className="my-3">
				<ScrollShadow className="flex flex-col gap-5">
					{ data && <>
						{ data.length === 0 && <i className="mx-auto">Keine Öffentlichen Runden</i> }
						{ data?.map(game => <GameInfo key={ game.id } state={ state } game={ game }/> ) }
					</> }
				</ScrollShadow>
				{ state === "error" && <ErrorModal error={ error! } isOpen={ isOpen } onOpenChange={ onOpenChange }/> }
			</CardBody>
		</Card>
	)
}

function GameInfo({ state, game }: { state: RequestState, game: Game }) {
	return (
		<Link key={ game.id } to={ `/game/${ game.id }` }>
			<Card className="flex-shrink-0 bg-default-100 mx-5 hover:scale-x-[1.025]">
				<CardHeader className="flex justify-between">
					<Skeleton isLoaded={ state === "success" } className="rounded-lg px-2">
						<div className="font-bold h-6">{ game.players.find(p => p.master)?.name }</div>
					</Skeleton>
					<Skeleton isLoaded={ state === "success" } className="rounded-lg px-2">
						<div className="h-6">Spieler-Anzahl: <b>{ game.players.length }</b></div>
					</Skeleton>
				</CardHeader>
				<Divider></Divider>
				<CardBody className="flex flex-col md:flex-row justify-between gap-10">
					<Skeleton isLoaded={ state === "success" } className="rounded-lg flex-grow md:w-1/3">
						<h3 className="font-bold">Rollen</h3>
						<CheckboxGroup
							aria-label="Spezial-Rollen" size="md"
							value={ game.settings.roles }
							isReadOnly={ true }
						>
							{ [ ...roleDescriptions.keys() ].map(role =>
								<Checkbox key={ role } value={ role }>{ roleNames.get(role) }</Checkbox>
							) }
						</CheckboxGroup>
					</Skeleton>

					<Skeleton isLoaded={state === "success"} className="rounded-lg flex-grow md:w-1/3">
						<h3 className="font-bold">Einstellungen</h3>
						<ul className="flex flex-col flex-wrap gap-2 max-h-56">
							<SettingsDisplay game={ game } readOnly update={() => {}}/>
						</ul>
					</Skeleton>

					<Skeleton isLoaded={state === "success"} className="rounded-lg flex-grow md:w-1/3">
						<h3 className="font-bold">Spieler</h3>
						<ul className="flex flex-col flex-wrap gap-2 max-h-56">
							{ game.players.slice(0, 8).map(player =>
								<li key={ player.id }>
									{ player.name }
								</li>
							) }
						</ul>
					</Skeleton>
				</CardBody>
			</Card>
		</Link>
	)
}