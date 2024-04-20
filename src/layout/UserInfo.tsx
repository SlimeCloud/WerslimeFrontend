import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { GameState } from "../types/GameState.ts";
import { useToken } from "../hooks/useToken.ts";
import { useNavigate } from "react-router";
import { useRest } from "../hooks/useRest.ts";

export default function UserInfo({ gameState }: { gameState: GameState }) {
	const navigate = useNavigate()
	const { setToken } = useToken()

	const { post: reset } = useRest("/game/reset")
	const { post: leave } = useRest("/game/leave")


	return (
		<Dropdown placement="bottom-end">
			<DropdownTrigger>
				<Avatar
					isBordered as="button" className="transition-transform"
					color="primary" size="sm"
				/>
			</DropdownTrigger>
			<DropdownMenu aria-label="Nutzer Optionen" variant="flat">
				<DropdownItem className="h-14 gap-2" textValue="Nutzer Info">
					<p className="font-semibold">Aktuell eingeloggt als</p>
					<p className="font-semibold text-primary">{ gameState.player.name }</p>
				</DropdownItem>

				<DropdownItem onPress={ () => navigate(`/game/${ gameState.game.id }`) }>Zurück zur Runde</DropdownItem>
				{ (gameState.player.master && <DropdownItem onPress={ () => reset() } color="warning">Runde Zurücksetzten</DropdownItem>) as never }
				<DropdownItem color="danger" onPress={ () => {
					leave()
					setToken("")
					navigate("/")
				} }>{ gameState.player.master ? "Runde Schließen" : "Runde Verlassen" }</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	)
}