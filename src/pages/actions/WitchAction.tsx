import { Request } from "../../hooks/useRest.ts"
import { Button, Image, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/react"
import heal from "../../assets/action/heal.png"
import poison from "../../assets/action/poison.png"
import { useGameState } from "../../hooks/useGameState.ts"
import { useEffect, useState } from "react"
import array from "../../utils/array.ts"
import { Action } from "./Action.ts"

export default function useWitchAction(action: (req?: Request<unknown>) => void): Action {
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
	const [ target, setTarget ] = useState("")

	const { game, player } = useGameState()!

	useEffect(() => {
		onClose()
	}, [ game.interactions ])


	return {
		execute: target => {
			if(!player.alive || !target.alive || (target.id === player.id && target.id !== game.victim)) return
			if(target.id === game.victim && !array(game.roleMeta)?.includes("HEAL")) return
			if(target.id !== game.victim && !array(game.roleMeta)?.includes("POISON")) return

			return () => {
				setTarget(target.id)
				onOpen()
			}
		},
		node: <>
			<Modal isOpen={ isOpen } onOpenChange={ onOpenChange } size="sm" placement="center">
				<ModalContent>
					<ModalHeader className="flex justify-center">{ target === game.victim ? "Heilen" : "Vergiften" }</ModalHeader>
					<ModalBody>
						<div className="cursor-pointer flex justify-center" onClick={ () => {
							if(target === game.victim) action({ data: { action: "HEAL" } })
							else action({ data: { target: target, action: "POISON" } })
						} }>
							<Image
								alt={ target === game.victim ? "Heilen" : "Vergiften" }
								src={ target === game.victim ? heal : poison }
							/>
						</div>
					</ModalBody>
				</ModalContent>
			</Modal>
			<Button className="fixed bottom-[60px] left-5 z-20" onPress={ () => action({ data: { action: "SKIP" } }) }>Überspringen</Button>
		</>
	}
}