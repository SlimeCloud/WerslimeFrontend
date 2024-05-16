import { Request } from "../../hooks/useRest.ts"
import { Button, Card, CardBody, CardHeader, Divider, Image, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/react"
import { useContext, useEffect, useState } from "react"
import resetIcon from "../../assets/action/reset.png"
import { PlayerClickHandler, TargetContext } from "./PlayerClickHandler.ts"
import { useMap } from "usehooks-ts"
import { useGameState } from "../../hooks/useGameState.ts"
import { EMPTY_PLAYER, Player } from "../../types/Player.ts"

export interface Action {
	id: string,
	name: string,
	image: string,
	condition?: (target: Player) => boolean | undefined
}

export default function useMultiAction(action: (req?: Request<unknown>) => void, condition: (target: Player) => boolean | undefined, actions: Action[]): PlayerClickHandler {
	const { game } = useGameState()!
	const [ , setTargets ] = useContext(TargetContext)!
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()

	const [ target, setTarget ] = useState<Player>(EMPTY_PLAYER)
	const [ selected, selectedActions ] = useMap<string, string>()

	useEffect(() => {
		selectedActions.setAll([])
	}, [ game.current ])

	useEffect(() => {
		setTargets([ ...selected.values() ])
		onClose()
	}, [ selected ]);

	function confirm() {
		action({
			data: {
				actions: Object.fromEntries(selected.entries())
			},
			onSuccess: () => selectedActions.setAll([])
		})
	}

	return {
		execute: target => {
			if(!actions.length || game.interacted) return
			if(!condition(target)) return

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
						{ actions.map(action =>
							<Card key={ action.id } className={ `border-2 border-transparent ${ selected.get(action.id) === target.id ? "border-[gold]" : "" }` } isPressable onPress={ () => selectedActions.set(action.id, target.id) } isDisabled={ selected.get(action.id) === target.id || (action.condition && !action.condition(target)) }>
								<CardHeader className="font-bold flex justify-center px-5 whitespace-nowrap">{ action.name }</CardHeader>
								<Divider/>
								<CardBody>
									<Image src={ action.image } alt={ action.name } width="100%"/>
								</CardBody>
							</Card>
						) }

						<Card isPressable onPress={ () => selectedActions.setAll([ ...selected.entries() ].filter(([ , value ]) => value !== target.id)) } isDisabled={ ![ ...selected.values() ].includes(target.id) }>
							<CardHeader className="font-bold flex justify-center px-5">Zurücksetzen</CardHeader>
							<Divider/>
							<CardBody>
								<Image src={ resetIcon } alt="Zurücksetzen" width="100%"/>
							</CardBody>
						</Card>
					</ModalBody>
				</ModalContent>
			</Modal>
			{ !game.interacted && <Button color={ selected.size ? "primary" : "warning" } className="fixed bottom-[60px] left-5 z-20" onPress={ confirm }>Bestätigen</Button> }
		</>
	}
}