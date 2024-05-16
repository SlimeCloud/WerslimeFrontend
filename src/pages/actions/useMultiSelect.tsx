import { useContext, useEffect, useState } from "react"
import { Request } from "../../hooks/useRest.ts"
import { Button } from "@nextui-org/react"
import { useGameState } from "../../hooks/useGameState.ts"
import { PlayerClickHandler, TargetContext } from "./PlayerClickHandler.ts"
import { Player } from "../../types/Player.ts"

export default function useMultiSelect(action: (req?: Request<unknown>) => void, condition: (target: Player) => boolean | undefined, amount: number): PlayerClickHandler {
	const { game } = useGameState()!

	const [ , setTargets ] = useContext(TargetContext)!
	const [ selected, setSelected ] = useState([] as string[])

	useEffect(() => {
		setSelected([])
	}, [ game.current ])

	function confirm() {
		action({
			data: { targets: selected },
			onSuccess: () => setSelected([])
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
		node: <>
			{ (selected.length === amount && !game.interacted) && <Button color="primary" className="fixed bottom-[60px] block left-5 z-20" onPress={ confirm }>Bestätigen</Button> }
		</>
	}
}
