import { Request } from "../../hooks/useRest.ts"
import { Action, TargetContext } from "./Action.ts"
import { useGameState } from "../../hooks/useGameState.ts"
import { useContext, useEffect, useState } from "react"

export default function useVoteAction(action: (req?: Request<unknown>) => void): Action {
	const { game, player } = useGameState()!

	const [ selected, setSelected ] = useState("")
	const [ , setTargets ] = useContext(TargetContext)!

	useEffect(() => {
		setSelected("")
	}, [ game.current ])

	useEffect(() => {
		setTargets([ selected ])
	}, [ selected ])

	return {
		execute: target => {
			if(!player.alive || !target.alive) return

			return () => {
				if(target.id !== selected) {
					setSelected(target.id)
					action({ data: { target: target.id } })
				} else {
					setSelected("")
					action()
				}
			}
		},
		node: undefined
	}
}