import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { GameState } from "../types/GameState.ts";
import { useToken } from "../hooks/useToken.ts";
import { useNavigate } from "react-router";

export default function UserInfo({ gameState }: { gameState: GameState }) {
	const navigate = useNavigate()
	const { setToken } = useToken()

	return (
		<Dropdown placement="bottom-end">
			<DropdownTrigger>
				<Avatar
					isBordered as="button" className="transition-transform"
					color="primary" size="sm"
				/>
			</DropdownTrigger>
			<DropdownMenu aria-label="Profile Actions" variant="flat">
				<DropdownItem key="profile" className="h-14 gap-2">
					<p className="font-semibold">Aktuell eingeloggt als</p>
					<p className="font-semibold text-primary">{ gameState.player.name }</p>
				</DropdownItem>

				<DropdownItem onPress={ () => navigate(`/game/${ gameState.game.id }`) }>Zurück zur Runde</DropdownItem>
				<DropdownItem color="danger" onPress={ () => setToken("") }>Runde Verlassen</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	)
}