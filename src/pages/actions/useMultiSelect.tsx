import { useContext, useState } from "react"
import { Request } from "../../hooks/useRest.ts"
import { Button } from "@nextui-org/react"
import { useGameState } from "../../hooks/useGameState.ts"
import { PlayerClickHandler, TargetContext } from "./PlayerClickHandler.ts"
import { Player } from "../../types/Player.ts"

export default function useMultiSelect(action: (req?: Request<unknown>) => void, condition: (target: Player) => boolean | undefined, amount: number): PlayerClickHandler {
	const { game } = useGameState()!

	const [ , setTargets ] = useContext(TargetContext)!
	const [ selected, setSelected ] = useState([] as string[])

	function confirm() {
		action({
			data: { targets: selected },
			onSuccess: () => setTargets([])
		})
	}

	return {
		execute: target => {
			if(game.interacted) return
			if(selected.length >= amount && !selected.includes(target.id)) return
			if(!condition(target)) return

			return () => setSelected(old => {
				if(!old.includes(target.id)) old.push(target.id)
				else old.splice(old.indexOf(target.id), 1)

				setTargets([ ...old ])

				return [ ...old ]
			})
		},
		confirm: (selected.length === amount && !game.interacted) && <Button color="primary" onPress={ confirm }>Bestätigen</Button>
	}
}
