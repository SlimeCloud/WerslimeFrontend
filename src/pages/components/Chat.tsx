import { useGameState } from "../../hooks/useGameState.ts";
import { Game } from "../../types/Game.ts";
import { Message } from "../../types/Message.ts";
import { FormEvent, useState } from "react";
import { Card, CardBody, CardHeader, Divider, Image, Input, ScrollShadow } from "@nextui-org/react";
import PlayerName from "./PlayerName.tsx";
import { roleImages, roleNames } from "../../types/Role.ts";
import { useRest } from "../../hooks/useRest.ts";

export default function Chat({ messages }: { messages: Message[] }) {
	const { game, player } = useGameState()!

	const [ message, setMessage ] = useState("")
	const { post } = useRest("/games/@me/chat")

	function sendMessage(e: FormEvent) {
		e.preventDefault()

		if(!message) return

		post({ data: { message } })
		setMessage("")
	}

	return (
		<Card className="w-[50vw] lg:w-[30vw]">
			<CardHeader className="py-2 font-bold text-lg flex flex-wrap justify-between"><span className="flex items-center gap-2"><Image src={ roleImages.get(game.current) } width="20px"/> { roleNames.get(game.current) }-Chat</span></CardHeader>
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

	return (
		<li className="bg-default-100 p-2 rounded-lg flex flex-col">
			{ author ? <PlayerName bold player={ author }/> : <b>***</b> }
			{ message.message }
		</li>
	)
}