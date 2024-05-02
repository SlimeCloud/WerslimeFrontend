import { Avatar, Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/react";
import { GameState } from "../types/GameState.ts";
import { useToken } from "../hooks/useToken.ts";
import { useNavigate } from "react-router";
import { useRest } from "../hooks/useRest.ts";
import { roleImages } from "../types/Role.ts"
import { FormEvent, useMemo, useState } from "react"
import ErrorModal from "../components/ErrorModal.tsx"
import Spinner from "../components/Spinner.tsx"

export default function UserInfo({ gameState }: { gameState: GameState }) {
	const navigate = useNavigate()
	const { setToken } = useToken()

	const { game, player } = gameState

	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
	const { isOpen: isErrorOpen, onOpen: onErrorOpen, onOpenChange: onErrorOpenChange } = useDisclosure()

	const { delete: reset } = useRest("/games/@me/session")
	const { delete: leave } = useRest("/@me/game")

	const { state, error, patch: renameExec } = useRest("/@me", {
		onError: onErrorOpen,
		onSuccess: onClose
	})

	const [ name, setName ] = useState(player.name)
	const invalid = useMemo(() => !/^[a-zA-Z0-9_-]{3,16}$/.test(name), [ name ])

	function rename(e?: FormEvent) {
		e?.preventDefault()
		if(invalid) return

		renameExec({ data: { name: name } })
	}

	return (
		<>
			<Dropdown placement="bottom-end">
				<DropdownTrigger>
					<Avatar
						isBordered as="button" className="transition-transform"
						color="primary" size="sm"
						src={ player.avatar || (game.started ? roleImages.get(player.role) : undefined) }
					/>
				</DropdownTrigger>
				<DropdownMenu aria-label="Nutzer Optionen" variant="flat">
					<DropdownItem className="h-14 gap-2" textValue="Nutzer Info" onPress={ () => !player.avatar && onOpen() } isDisabled={ isOpen || game.started }>
						<p className="font-semibold">Aktuell eingeloggt als</p>
						<p className="font-semibold text-primary">{ player.name }</p>
					</DropdownItem>

					<DropdownItem onPress={ () => navigate(`/game/${ game.id }`) }>Zurück zur Runde</DropdownItem>
					{ (player.master && <DropdownItem onPress={ () => reset() } color="warning">Runde Zurücksetzten</DropdownItem>) as never }
					<DropdownItem color="danger" onPress={ () => {
						leave()
						setToken("")
						navigate("/")
					} }>{ (player.master && game.players.filter(p => p.master).length === 1) ? "Runde Schließen" : "Runde Verlassen" }</DropdownItem>
				</DropdownMenu>
			</Dropdown>
			<Modal isOpen={ isOpen } onOpenChange={ onOpenChange }>
				<ModalContent>
					<ModalHeader>Name Ändern</ModalHeader>
					<Divider/>
					<ModalBody className="py-5">
						<form className="gap-5 flex flex-col" onSubmit={ rename }>
							<Input
								label="Name" placeholder="Gib deinen Namen ein"
								value={ name }
								onValueChange={ setName }
								maxLength={ 16 }
							/>
							<Button isDisabled={ invalid } className="h-[45px]" color="primary" spinner={ <Spinner/> } onPress={ () => rename() } isLoading={ state === "loading" }>Name Ändern</Button>
						</form>
					</ModalBody>
				</ModalContent>
			</Modal>

			<ErrorModal error={ error! } isOpen={ isErrorOpen } onOpenChange={ onErrorOpenChange }/>
		</>
	)
}