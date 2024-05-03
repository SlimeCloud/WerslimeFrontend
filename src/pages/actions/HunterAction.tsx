import { Button, Image, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/react"
import shoot from "../../assets/action/shoot.png"
import { Request } from "../../hooks/useRest.ts"
import { useEffect, useState } from "react"
import { useGameState } from "../../hooks/useGameState.ts"
import { Action } from "./Action.ts"

export default function useHunterAction(action: (req?: Request<unknown>) => void): Action {
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
	const [ target, setTarget ] = useState("")

	const { game } = useGameState()!

	useEffect(() => {
		onClose()
	}, [ game.interactions ])

	return {
		execute: target => {
			if(!target.alive) return
			if(game.interacted) return

			return () => {
				setTarget(target.id)
				onOpen()
			}
		},
		node: <>
			<Modal isOpen={ isOpen } onOpenChange={ onOpenChange } size="sm" placement="center">
				<ModalContent>
					<ModalHeader className="py-3 flex justify-center">Erschießen</ModalHeader>
					<ModalBody>
						<div className="cursor-pointer flex justify-center" onClick={ () => action({ data: { target: target } }) }>
							<Image
								width="300px"
								alt="Rolle Ansehen" isZoomed isBlurred
								src={ shoot }
							/>
						</div>
					</ModalBody>
				</ModalContent>
			</Modal>
			<Button color="warning" className="fixed bottom-[60px] block left-5 z-20" onPress={ () => action({ data: { target: null } }) }>Überspringen</Button>
		</>
	}
}
