import { useContext, useEffect, useState } from "react"
import { Request } from "../../hooks/useRest.ts"
import { Button } from "@nextui-org/react"
import { useGameState } from "../../hooks/useGameState.ts"
import { Action, TargetContext } from "./Action.ts"

export default function useArmorAction(action: (req?: Request<unknown>) => void): Action {
	const [ selected, setSelected ] = useState([] as string[])
	const { game, player } = useGameState()!

	const [ , setTargets ] = useContext(TargetContext)!

	useEffect(() => {
		setSelected([])
	}, [ game.current ])

	return {
		execute: target => {
			if(!player.alive || !target.alive || (target.id === player.id && target.id !== game.victim)) return
			if(game.interacted) return
			if(selected.length >= 2 && !selected.includes(target.id)) return

			return () => setSelected(old => {
				if(!old.includes(target.id)) old.push(target.id)
				else old.splice(old.indexOf(target.id), 1)

				setTargets([ ...old ])

				return [ ...old ]
			})
		},
		node: <>
			{ selected.length === 2 &&  <Button color="primary" className="fixed bottom-[60px] block left-5 z-20" onPress={ () => action({ data: { first: selected[0], second: selected[1] } }) }>Bestätigen</Button> }
		</>
	}
}
