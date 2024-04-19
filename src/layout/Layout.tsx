import { Outlet } from "react-router";
import Navigation from "./Navigation.tsx";
import Footer from "./Footer.tsx";
import { Suspense } from "react";
import { GameStateContext } from "../hooks/useGameState.ts";
import { useRest } from "../hooks/useRest.ts";
import { GameState } from "../types/GameState.ts";
import Spinner from "../components/Spinner.tsx";

export default function Layout() {
	const { state, data } = useRest<GameState>("/@me", { auto: true })

	return (
		<div className="w-screen h-screen gap-10 flex flex-col items-start justify-center md:gap-32">
			<Navigation gameState={ data }/>
			<div className="w-[80vw] mx-auto flex-grow flex gap-20 justify-center flex-col md:flex-row overflow-auto p-5">
				<Suspense fallback={ <Spinner/> }>
					{ state === "loading" ? <Spinner className="m-auto w-[35px] h-[35px]"/> :
						<GameStateContext.Provider value={ data }>
							<Outlet/>
						</GameStateContext.Provider>
					}
				</Suspense>
			</div>
			<Footer/>
		</div>
	)
}