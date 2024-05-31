import { useState } from "react";
import { useEvent } from "./useEvent.ts";
import { EventType } from "../types/EventType.ts";

export function useServerValue<T>(event: EventType, initialValue: T, onUpdate?: (value: T) => void) {
	const [ state, setState ] = useState(initialValue)

	useEvent(event, data => {
		setState(data as T)
		onUpdate && onUpdate(data as T)
	})

	return state
}