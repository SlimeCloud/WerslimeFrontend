import { useState } from "react";
import { useEvent } from "./useEvent.ts";

export function useServerValue<T>(event: string, initialValue: T) {
	const [ state, setState ] = useState(initialValue)

	useEvent(event, setState)

	return state
}