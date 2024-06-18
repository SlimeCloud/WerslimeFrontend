import victim from "../../assets/modifier/victim.png"
import { getEffectiveRole, Player } from "../../types/Player.ts"
import { Avatar, Image, Tooltip } from "@nextui-org/react"
import { roleImages, roleNames } from "../../types/Role.ts"
import { useGameState } from "../../hooks/useGameState.ts"
import { modifierImages, modifierNames } from "../../types/Modifier.ts"

export default function PlayerName({ player, role = false, modifier = true, bold = false, className }: { player: Player, role?: boolean, modifier?: boolean, bold?: boolean, className?: string }) {
	const { game } = useGameState()!

	return (
		<span className={ `flex gap-2 items-center ${ bold ? "font-bold" : "" } ${ className || "" } w-fit` }>
			{ player.avatar && <Avatar size="sm" src={ player.avatar } className="transition-transform h-[25px] w-[25px]"/> }
			{ player.name }

			<span className="flex gap-1">
				{ role && <Tooltip content={ roleNames.get(player.role || "UNKNOWN") }>
					<Image src={ roleImages.get(getEffectiveRole(player)) } width="30px"/>
				</Tooltip> }

				{ modifier && player.modifiers.map(modifier =>
					<Tooltip content={ modifierNames.get(modifier) } key={ modifier }>
						<Image alt={ modifierNames.get(modifier) } src={ modifierImages.get(modifier) } width="25px" className="pixel"/>
					</Tooltip>
				) }

				{ player.id === game.victim && <Tooltip content="Opfer der Nacht"><Image alt="Opfer der Nacht" src={ victim } width="25px" className="pixel"/></Tooltip> }
			</span>
		</span>
	)
}