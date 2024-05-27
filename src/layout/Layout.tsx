import { Outlet } from "react-router";
import Navigation from "./Navigation.tsx";
import Footer from "./Footer.tsx";
import { Suspense } from "react";
import { GameStateContext, GameStateRequestContext } from "../hooks/useGameState.ts";
import { useRest } from "../hooks/useRest.ts";
import { GameState } from "../types/GameState.ts";
import { CircularProgress } from "@nextui-org/react";

export default function Layout() {
	const request = useRest<GameState>("/@me", { auto: true })

	return (
		<div className="w-screen h-screen gap-5 h-md:md:gap-12 flex flex-col items-start justify-center">
			<Navigation gameState={ request.data }/>
			<div className="w-[98vw] lg:w-[80vw] mx-auto flex-grow flex gap-5 md:gap-20 justify-center flex-col md:flex-row overflow-auto p-5">
				<Suspense fallback={ <CircularProgress className="m-auto" aria-label="Lade Seite"/> }>
					{ request.state === "loading" ? <CircularProgress className="m-auto" aria-label="Lade letztes Spiel"/> :
						<GameStateContext.Provider value={ request.data }>
							<GameStateRequestContext.Provider value={ request }>
								<Outlet/>
							</GameStateRequestContext.Provider>
						</GameStateContext.Provider>
					}
				</Suspense>
			</div>
			<Footer/>
		</div>
	)
}