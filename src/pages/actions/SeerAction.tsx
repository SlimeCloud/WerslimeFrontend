import { Request } from "../../hooks/useRest.ts"
import { Button, Divider, Image, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/react"
import view from "../../assets/action/view.png"
import { useGameState } from "../../hooks/useGameState.ts"
import { useEffect, useState } from "react"
import array from "../../utils/array.ts"
import { Action } from "./Action.ts"
import { Player } from "../../types/Player.ts"
import { Role, roleImages, roleNames } from "../../types/Role.ts"

export default function useSeerAction(action: (req?: Request<unknown>) => void): Action {
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
	const { isOpen: isInfoOpen, onOpen: onInfoOpen, onOpenChange: onInfoOpenChange } = useDisclosure()

	const [ target, setTarget ] = useState<Player>({} as Player)
	const [ result, setResult ] = useState<Role>()

	const { game, player } = useGameState()!

	useEffect(() => {
		onClose()
	}, [ game.interactions ])

	return {
		execute: target => {
			if(!player.alive || !target.alive || target.id === player.id) return
			if(array(game.roleMeta)?.includes(target.id)) return
			if(game.interacted) return

			return () => {
				setTarget(target)
				onOpen()
			}
		},
		node: <>
			<Modal isOpen={ isOpen } onOpenChange={ onOpenChange } size="sm" placement="center">
				<ModalContent>
					<ModalHeader className="py-3 flex justify-center">Rolle Ansehen</ModalHeader>
					<ModalBody>
						<div className="cursor-pointer flex justify-center" onClick={ () => action({
							data: { target: target.id }, onSuccess: data => {
								setResult((data as { role: Role }).role)
								onInfoOpen()
							}
						}) }>
							<Image width="300px" isZoomed isBlurred alt="Rolle Ansehen" src={ view }/>
						</div>
					</ModalBody>
				</ModalContent>
			</Modal>

			<Modal isOpen={ isInfoOpen } onOpenChange={ onInfoOpenChange } size="sm" placement="center">
				<ModalContent>
					<ModalHeader className="py-3 flex justify-center">Rolle von { target.name }</ModalHeader>
					<Divider/>
					<ModalBody className="flex flex-row items-center m-auto p-5 font-bold text-lg">
						<Image width="50px" isBlurred alt={ roleNames.get(result!) } src={ roleImages.get(result!) }/>
						{ roleNames.get(result!) }
					</ModalBody>
				</ModalContent>
			</Modal>

			{ !game.interacted && <Button color="warning" className="fixed bottom-[60px] left-5 z-20" onPress={ () => action({ data: { target: "" } }) }>Überspringen</Button> }
		</>
	}
}