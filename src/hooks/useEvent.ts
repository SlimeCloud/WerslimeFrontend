import { createContext, useContext, useEffect, useRef } from "react";

export const EventSourceContext = createContext<EventSource | undefined>(undefined)

interface ListenerInfo {
	listener: (event: MessageEvent) => void
	event: string
}

export function useEvent<T>(event: string, handler: (data: T) => void) {
	const source = useContext(EventSourceContext)
	const current = useRef<ListenerInfo>()

	if(!source) throw new Error("Could not find an Event context. You have to wrap useEvent() in an <EventProvider>");

	useEffect(() => {
		if(current.current) source?.removeEventListener(current.current?.event, current.current?.listener)
		const listener = (event: MessageEvent) => handler(event.data ? JSON.parse(event.data) : {})

		source?.addEventListener(event, listener)
		current.current = { listener, event }

		return () => source?.removeEventListener(event, listener)
	}, [ event, handler, source ])
}