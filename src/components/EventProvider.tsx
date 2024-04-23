import { EventSourceContext } from "../hooks/useEvent.ts";
import { useToken } from "../hooks/useToken.ts";
import { ReactNode, useEffect, useMemo } from "react";
import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"

export default function EventProvider({ route, children }: { route: string, children?: ReactNode }) {
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
	const { token } = useToken()

	const source = useMemo(() => {
		const ws = new WebSocket(`${ import.meta.env._WS }${ route }?token=${ token }`)
		ws.onclose = onOpen

		return ws
	}, [ route, token ])

	useEffect(() => {
		return () => source.close()
	}, [ source ]);

	return (
		<>
			<EventSourceContext.Provider value={ source }>
				{ children }
			</EventSourceContext.Provider>

			<Modal isOpen={ isOpen } onOpenChange={ onOpenChange }>
				<ModalContent>
					<ModalHeader>Verbindung getrennt</ModalHeader>
					<Divider/>

					<ModalBody>
						Die Verbindung zum Server wurde Unterbrochen. Überprüfe deine Internet-Verbindung und stelle sicher, dass diese Seite nur in einem Tab geöffnet ist.
					</ModalBody>

					<Divider/>
					<ModalFooter>
						<Button color="primary" size="sm" onPress={ () => {
							source.close()
							onClose()
						} }>Erneut Verbinden</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}