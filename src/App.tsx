import { Route, Routes, useNavigate } from "react-router";
import Layout from "./layout/Layout.tsx";
import { NextUIProvider } from "@nextui-org/react";
import { lazy } from "react";
import InstructionsPage from "./pages/InstructionsPage.tsx";

const HomePage = lazy(() => import("./pages/HomePage.tsx"));
const GamePage = lazy(() => import("./pages/GamePage.tsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.tsx"));

export default function App() {
	const navigate = useNavigate()

	return (
		<NextUIProvider navigate={ navigate }>
			<Routes>
				<Route path="/" element={ <Layout/> }>
					<Route path="/" element={ <HomePage/> }/>
					<Route path="/instructions" element={ <InstructionsPage/> }/>
					<Route path="/game/:id" element={ <GamePage/> }/>
					<Route path="*" element={ <NotFoundPage/> }/>
				</Route>
			</Routes>
		</NextUIProvider>
	)
}