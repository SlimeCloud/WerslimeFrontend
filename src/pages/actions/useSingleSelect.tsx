import { Request } from "../../hooks/useRest.ts"
import { PlayerClickHandler, TargetContext } from "./PlayerClickHandler.ts"
import { useGameState } from "../../hooks/useGameState.ts"
import { useContext } from "react"
import { Player } from "../../types/Player.ts"

export default function useSingleSelect(action: (req?: Request<unknown>) => void, condition: (target: Player) => boolean | undefined): PlayerClickHandler {
	const { game, player } = useGameState()!
	const [ , setTargets ] = useContext(TargetContext)!

	return {
		execute: target => {
			if(!condition(target)) return

			return () => {
				if(target.id !== game.interactions![player.id as keyof typeof game.interactions] as string) {
					setTargets([ target.id ])
					action({ data: { target: target.id } })
				} else {
					setTargets([])
					action({ data: { target: "" } })
				}
			}
		},
		node: undefined
	}
}