import { useLocalStorage } from "usehooks-ts";

export function useVolume() {
	const [ volume, setVolume ] = useLocalStorage<number>("volume", 100)

	return {
		volume: volume,
		setVolume: (volume: number) => setVolume(volume)
	}
}