import { getEffectiveRole, Player } from "../../types/Player.ts"
import { Avatar, Image, Tooltip } from "@nextui-org/react"
import lover from "../../assets/modifier/lover.png"
import mayor from "../../assets/modifier/mayor.png"
import { roleImages, roleNames } from "../../types/Role.ts"

export default function PlayerName({ player, role = false, modifier = true, bold = false, className }: { player: Player, role?: boolean, modifier?: boolean, bold?: boolean, className?: string }) {
	return (
		<span className={ `flex gap-2 items-center ${ bold ? "font-bold" : "" } ${ className || "" }` }>
			{ player.avatar && <Avatar size="sm" src={ player.avatar } className="transition-transform h-[25px] w-[25px]"/> }
			{ player.name }

			<span className="flex gap-1">
				{ role && <Tooltip content={ roleNames.get(player.role || "UNKNOWN") }>
					<Image src={ roleImages.get(getEffectiveRole(player)) } width="30px"/>
				</Tooltip> }

				{ modifier && <>
					{ player.modifiers.includes("LOVER") && <Tooltip content="Verliebt"><Image alt="Verliebt" src={ lover } width="25px" className="pixel"/></Tooltip> }
					{ player.modifiers.includes("MAYOR") && <Tooltip content="Bürgermeister"><Image alt="Bürgermeister" src={ mayor } width="25px" className="pixel"/></Tooltip> }
				</>}
			</span>
		</span>
	)
}