import { createContext, Dispatch, ReactNode, SetStateAction } from "react"
import { Player } from "../../types/Player.ts"

export const TargetContext = createContext<[ string[], Dispatch<SetStateAction<string[]>> ] | undefined>(undefined)

export interface Action {
	node: ReactNode,
	execute: (target: Player) => (() => void) | undefined
}