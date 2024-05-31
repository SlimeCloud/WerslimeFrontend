import { useGameState } from "../../hooks/useGameState.ts";
import { Game } from "../../types/Game.ts";
import { Message } from "../../types/Message.ts";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { Card, CardBody, CardHeader, Divider, Image, Input, ScrollShadow } from "@nextui-org/react";
import PlayerName from "./PlayerName.tsx";
import { roleImages, roleNames } from "../../types/Role.ts";
import { useRest } from "../../hooks/useRest.ts";
import { useEvent } from "../../hooks/useEvent.ts";

export default function Chat({ messages, setMessages }: { messages: Message[], setMessages: Dispatch<SetStateAction<Message[]>> }) {
	const { game, player } = useGameState()!

	const [ message, setMessage ] = useState("")
	const { post } = useRest("/games/@me/chat")

	useEvent<Message>("CHAT", message => {
		setMessages(old => {
			const temp = [ ...old, message ]
			if(temp.length > 50) temp.shift()
			return temp
		})
	})

	function sendMessage(e: FormEvent) {
		e.preventDefault()

		if(!message) return

		post({ data: { message } })
		setMessage("")
	}

	return (
		<Card className="w-[50vw] lg:w-[30vw]">
			<CardHeader className="py-2 font-bold text-lg flex flex-wrap justify-between">Rollen-Chat <span className="flex items-center gap-2"><Image src={ roleImages.get(game.current) } width="20px"/> { roleNames.get(game.current) }</span></CardHeader>
			<Divider/>
			<CardBody className="h-[30vh] p-2 gap-2">
				{ player.alive &&
					<form onSubmit={ sendMessage } className="w-full">
						<Input placeholder="Nachricht Senden" value={ message } onValueChange={ setMessage } maxLength={ 100 }/>
					</form>
				}
				<ScrollShadow size={ 20 }>
					<ul className="flex flex-col-reverse gap-2">
						{ messages.map(message => <MessageDisplay key={ message.id } game={ game } message={ message }/>) }
					</ul>
					{ !messages.length && <i>Keine Nachrichten</i> }
				</ScrollShadow>
			</CardBody>
		</Card>
	)
}

function MessageDisplay({ game, message }: { game: Game, message: Message }) {
	const author = game.players.find(p => p.id === message.author)
	if(!author) return

	return (
		<li className="bg-default-100 p-2 rounded-lg">
			<PlayerName bold player={ author }/>
			{ message.message }
		</li>
	)
}