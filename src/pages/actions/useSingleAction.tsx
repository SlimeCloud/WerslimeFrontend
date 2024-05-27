import { Request } from "../../hooks/useRest.ts"
import { Button, Card, CardBody, CardHeader, Divider, Image, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/react"
import { useContext, useEffect, useState } from "react"
import { PlayerClickHandler, TargetContext } from "./PlayerClickHandler.ts"
import { useGameState } from "../../hooks/useGameState.ts"
import { EMPTY_PLAYER, Player } from "../../types/Player.ts"
import { Action } from "./useMultiAction.tsx"

export default function useSingleAction(action: (req?: Request<unknown>) => void, condition: (target: Player) => boolean | undefined, actions: Action): PlayerClickHandler {
	const { game } = useGameState()!
	const [ , setTargets ] = useContext(TargetContext)!
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()

	const [ target, setTarget ] = useState<Player>(EMPTY_PLAYER)
	const [ selected, setSelected ] = useState("")

	useEffect(() => {
		setSelected("")
	}, [ game.current ])

	useEffect(() => {
		setTargets([ selected ])
		onClose()
	}, [ selected ]);

	function confirm() {
		action({
			data: { [actions.id]: selected },
			onSuccess: () => setSelected("")
		})
	}

	return {
		execute: target => {
			if(game.interacted) return
			if(!condition(target)) return
			if(target.id === selected) return

			return () => {
				setTarget(target)
				onOpen()
			}
		},
		node: <>
			<Modal isOpen={ isOpen } onOpenChange={ onOpenChange } size="lg" placement="center">
				<ModalContent>
					<ModalHeader className="py-3 font-bold flex justify-center text-xl">Wähle eine Aktion</ModalHeader>
					<ModalBody className="grid grid-cols-3 gap-2 px-10 py-5">
						<span/>
						<Card className="hover:scale-[1.05] mx-auto bg-default-100" isPressable onPress={ () => setSelected(target.id) } isDisabled={ actions.condition && !actions.condition(target) }>
							<CardHeader className="font-bold flex justify-center px-5 whitespace-nowrap">{ actions.name }</CardHeader>
							<Divider/>
							<CardBody>
								<Image src={ actions.image } alt={ actions.name } width="100%" className="pixel"/>
							</CardBody>
						</Card>
					</ModalBody>
				</ModalContent>
			</Modal>
			{ !game.interacted && <Button color={ selected ? "primary" : "warning" } className="fixed bottom-[60px] left-5 z-20" onPress={ confirm }>Bestätigen</Button> }
		</>
	}
}