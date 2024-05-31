import { createContext, useContext, useEffect } from "react";
import { EventType } from "../types/EventType.ts";

export const EventSourceContext = createContext<WebSocket | undefined>(undefined)

interface Payload<T> {
	type: string
	data: T
}

export function useEvent<T>(eventName: EventType, handler: (data: T) => void) {
	const source = useContext(EventSourceContext)
	if(!source) throw new Error("Could not find an Event context. You have to wrap useEvent() in an <EventProvider>");


	useEffect(() => {
		const listener = (event: MessageEvent) => {
			const payload = JSON.parse(event.data) as Payload<T>
			if(payload.type !== eventName) return

			handler(payload.data)
		}

		source.addEventListener("message", listener)
		return () => source?.removeEventListener("message", listener)
	}, [ eventName, handler, source ])
}