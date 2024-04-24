import { Request } from "../../hooks/useRest.ts"
import { Button, Image, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/react"
import heal from "../../assets/action/heal.png"
import poison from "../../assets/action/poison.png"
import { useGameState } from "../../hooks/useGameState.ts"
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Player } from "../../types/Player.ts"
import array from "../../utils/array.ts"

const WitchAction = forwardRef<(target: Player) => (() => void) | undefined, { action: (req?: Request) => void }>((props, ref) => WitchActionImpl({ ref, ...props }))
export default WitchAction

function WitchActionImpl({ action, ref }: { action: (req?: Request) => void, ref: ForwardedRef<(target: Player) => (() => void) | undefined> }) {
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
	const [ target, setTarget ] = useState("")

	const { game, player } = useGameState()!

	useImperativeHandle(ref, () => target => {
		if(!player.alive || !target.alive || (target.id === player.id && target.id !== game.victim)) return
		if(target.id === game.victim && !array(game.roleMeta)?.includes("HEAL")) return
		if(target.id !== game.victim && !array(game.roleMeta)?.includes("POISON")) return
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
		<>
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
			{ !game.interacted && <Button className="fixed bottom-[60px] left-5 z-20" onPress={ () => action({ data: { action: "SKIP" } }) }>Überspringen</Button> }
		</>
	)
}