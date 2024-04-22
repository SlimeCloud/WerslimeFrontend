import { useLocalStorage } from "usehooks-ts";

export function useName() {
	const [ name, setName ] = useLocalStorage<string>("name", "")

	return {
		name: name,
		setName: (state: string) => setName(state)
	}
}