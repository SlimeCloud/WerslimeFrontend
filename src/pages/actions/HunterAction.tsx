import { Image, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/react"
import shoot from "../../assets/action/shoot.png"
import { Request } from "../../hooks/useRest.ts"
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { useGameState } from "../../hooks/useGameState.ts"
import { Player } from "../../types/Player.ts"

const HunterAction = forwardRef<(target: Player) => (() => void) | undefined, { action: (req?: Request) => void }>((props, ref) => HunterActionImpl({ ref, ...props }))
export default HunterAction

function HunterActionImpl({ action, ref }: { action: (req?: Request) => void, ref: ForwardedRef<(target: Player) => (() => void) | undefined> }) {
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
	const [ target, setTarget ] = useState("")

	const { game } = useGameState()!

	useImperativeHandle(ref, () => target => {
		if(!target.alive) return
		if(game.interacted) return

		return () => {
			setTarget(target.id)
			onOpen()
		}
	})

	useEffect(() => {
		onClose()
	}, [ game.interactions ])

	return (
		<Modal isOpen={ isOpen } onOpenChange={ onOpenChange } size="sm" placement="center">
			<ModalContent>
				<ModalHeader className="flex justify-center">Erschießen</ModalHeader>
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
	)
}