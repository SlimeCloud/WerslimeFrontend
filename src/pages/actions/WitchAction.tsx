import { Request } from "../../hooks/useRest.ts"
import { Button, Card, CardBody, CardHeader, Divider, Image, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/react"
import { useGameState } from "../../hooks/useGameState.ts"
import { useContext, useEffect, useState } from "react"
import { Action, TargetContext } from "./Action.ts"
import array from "../../utils/array.ts"

import healIcon from "../../assets/action/heal.png"
import poisonIcon from "../../assets/action/poison.png"
import resetIcon from "../../assets/action/reset.png"

export default function useWitchAction(action: (req?: Request<unknown>) => void): Action {
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
	const [ target, setTarget ] = useState("")

	const { game, player } = useGameState()!
	const [ heal, setHeal ] = useState("")
	const [ poison, setPoison ] = useState("")

	const [ , setTargets ] = useContext(TargetContext)!

	useEffect(() => {
		setHeal("")
		setPoison("")
	}, [ game.current ])

	useEffect(() => {
		setTargets([ heal, poison ])
		onClose()
	}, [ heal, poison ]);

	function confirm() {
		action({
			data: {
				actions: {
					"HEAL": heal || null,
					"POISON": poison || null
				},
			},
			onSuccess: () => {
				setHeal("")
				setPoison("")
			}
		})
	}

	return {
		execute: target => {
			if(!player.alive || !target.alive) return

			return () => {
				setTarget(target.id)
				onOpen()
			}
		},
		node: <>
			<Modal isOpen={ isOpen } onOpenChange={ onOpenChange } size="lg" placement="center">
				<ModalContent>
					<ModalHeader className="py-3 font-bold flex justify-center text-xl">Wähle eine Aktion</ModalHeader>
					<ModalBody className="grid grid-cols-3 gap-2 px-10 py-5">
						<Card className={ `border-2 border-transparent ${ target === heal ? "border-[gold]" : "" }` } isPressable onPress={ () => setHeal(target) } isDisabled={ target !== game.victim || target === heal || !array(game.roleMeta)?.includes("HEAL") }>
							<CardHeader className="font-bold flex justify-center px-5">Heilen</CardHeader>
							<Divider/>
							<CardBody>
								<Image src={ healIcon } alt="Heilen" width="100%"/>
							</CardBody>
						</Card>

						<Card className={ `border-2 border-transparent ${ target === poison ? "border-[gold]" : "" }` } isPressable onPress={ () => setPoison(target) } isDisabled={ target === game.victim || target === poison || !array(game.roleMeta)?.includes("POISON") }>
							<CardHeader className="font-bold flex justify-center px-5">Vergiften</CardHeader>
							<Divider/>
							<CardBody>
								<Image src={ poisonIcon } alt="Vergiften" width="100%"/>
							</CardBody>
						</Card>

						<Card isPressable onPress={ () => {
							if (heal === target) setHeal("")
							if (poison === target) setPoison("")
						} } isDisabled={ target !== heal && target !== poison }>
							<CardHeader className="font-bold flex justify-center px-5">Zurücksetzen</CardHeader>
							<Divider/>
							<CardBody>
								<Image src={ resetIcon } alt="Zurücksetzen" width="100%"/>
							</CardBody>
						</Card>
					</ModalBody>
				</ModalContent>
			</Modal>
			{ !game.interacted && <Button color={ (heal || poison) ? "primary" : "warning" } className="fixed bottom-[60px] left-5 z-20" onPress={ confirm }>Bestätigen</Button> }
		</>
	}
}