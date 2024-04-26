import { Request } from "../../hooks/useRest.ts"
import { Action, TargetContext } from "./Action.ts"
import { useGameState } from "../../hooks/useGameState.ts"
import { useContext } from "react"

export default function useVoteAction(action: (req?: Request<unknown>) => void): Action {
	const { game, player } = useGameState()!

	const [ , setTargets ] = useContext(TargetContext)!

	return {
		execute: target => {
			if(!player.alive || !target.alive) return

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