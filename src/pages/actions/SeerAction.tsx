import { Request } from "../../hooks/useRest.ts"
import { Image, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/react"
import view from "../../assets/action/view.png"
import { useGameState } from "../../hooks/useGameState.ts"
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Player } from "../../types/Player.ts"
import array from "../../utils/array.ts"

const SeerAction = forwardRef<(target: Player) => (() => void) | undefined, { action: (req?: Request) => void }>((props, ref) => SeerActionImpl({ ref, ...props }))
export default SeerAction

function SeerActionImpl({ action, ref }: { action: (req?: Request) => void, ref: ForwardedRef<(target: Player) => (() => void) | undefined> }) {
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
	const [ target, setTarget ] = useState("")

	const { game, player } = useGameState()!

	useImperativeHandle(ref, () => target => {
		if(!player.alive || !target.alive || target.id === player.id) return
		if(array(game.roleMeta)?.includes(target.id)) return
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
				<ModalHeader className="flex justify-center">{ game.current === "SEER" ? "Rolle Ansehen" : "Team Ansehen" }</ModalHeader>
				<ModalBody>
					<div className="cursor-pointer flex justify-center" onClick={ () => action({ data: { target: target } }) }>
						<Image
							width="300px" isZoomed isBlurred
							alt={ game.current === "SEER" ? "Rolle Ansehen" : "Team Ansehen" }
							src={ view }
						/>
					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}