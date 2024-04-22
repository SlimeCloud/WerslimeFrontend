import { useRest } from "../hooks/useRest.ts"
import Spinner from "../components/Spinner.tsx"
import ErrorModal from "../components/ErrorModal.tsx"
import { Button, Card, CardBody, CardHeader, Checkbox, CheckboxGroup, Divider, ScrollShadow, Skeleton, useDisclosure } from "@nextui-org/react"
import { Game } from "../types/Game.ts"
import { RefreshCw } from "lucide-react"
import { useNavigate } from "react-router"
import { roleNames, specialRoles } from "../types/Role.ts"

export default function GameListPage() {
	const navigate = useNavigate()

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
						{ data?.map(game =>
							<Card key={ game.id } className="flex-shrink-0 bg-default-100 mx-10" isPressable={ true } onPress={ () => navigate(`/game/${ game.id }`) }>
								<CardHeader className="flex justify-between">
									<Skeleton isLoaded={ state === "success" } className="rounded-lg px-2"><div className="font-bold h-6">{ game.players.find(p => p.master)?.name }</div></Skeleton>
									<Skeleton isLoaded={ state === "success" } className="rounded-lg px-2"><div className="h-6">Spieler-Anzahl: { game.players.length }</div></Skeleton>
								</CardHeader>
								<Divider></Divider>
								<CardBody className="flex flex-row justify-between gap-10">
									<Skeleton isLoaded={ state === "success" } className="rounded-lg flex-grow w-1/2">
										<h3 className="font-bold">Rollen</h3>
										<CheckboxGroup
											classNames={ { label: "font-bold [&_*]:!text-md" } }
											aria-label="Spezial-Rollen" size="md"
											value={ game.settings.roles }
											isReadOnly={ true }
										>
											{ specialRoles.map(role =>
												<Checkbox key={ role } value={ role }>{ roleNames.get(role) }</Checkbox>
											) }
										</CheckboxGroup>
									</Skeleton>

									<Skeleton isLoaded={ state === "success" } className="rounded-lg flex-grow w-1/2">
										<h3 className="font-bold">Spieler</h3>
										<ul className="flex flex-col flex-wrap gap-1 max-h-28">
											{ game.players.slice(0, 8).map(player =>
												<li key={ player.id }>
													{ player.name }
												</li>
											) }
										</ul>
									</Skeleton>
								</CardBody>
							</Card>
						) }
					</> }
				</ScrollShadow>
				{ state === "error" && <ErrorModal error={ error! } isOpen={ isOpen } onOpenChange={ onOpenChange }/> }
			</CardBody>
		</Card>
	)
}