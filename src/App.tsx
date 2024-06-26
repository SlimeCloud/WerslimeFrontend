import { Route, Routes } from "react-router";
import { lazy } from "react";
import Layout from "./layout/Layout.tsx"

const HomePage = lazy(() => import("./pages/HomePage.tsx"))
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.tsx"))
const ImpressPage = lazy(() => import("./pages/ImpressPage.tsx"))

const InstructionsPage = lazy(() => import("./pages/InstructionsPage.tsx"))
const GameListPage = lazy(() => import("./pages/GameListPage.tsx"))

const JoinPage = lazy(() => import("./pages/JoinPage.tsx"))
const OAuth2Page = lazy(() => import("./pages/OAuth2Page.tsx"))
const GamePage = lazy(() => import("./pages/GamePage.tsx"))

export default function App() {
	return (
		<Routes>
			<Route path="/" element={ <Layout/> }>
				<Route index element={ <HomePage/> }/>
				<Route path="impressum" element={ <ImpressPage/> }/>

				<Route path="anleitung" element={ <InstructionsPage/> }/>
				<Route path="games" element={ <GameListPage/> }/>

				<Route path="join" element={ <JoinPage/> }/>
				<Route path="oauth2" element={ <OAuth2Page/> }/>
				<Route path="game/:id" element={ <GamePage/> }/>

				<Route path="*" element={ <NotFoundPage/> }/>
			</Route>
		</Routes>
	)
}