import { Outlet } from "react-router";
import Navigation from "./Navigation.tsx";
import Footer from "./Footer.tsx";
import { Spinner } from "@nextui-org/react";
import { Suspense } from "react";

export default function Layout() {
	return (
		<div className="w-screen h-screen gap-10 flex flex-col items-start justify-center">
			<Navigation/>
			<div className="w-[80vw] mx-auto flex-grow flex justify-center">
				<Suspense fallback={ <Spinner/> }>
					<Outlet/>
				</Suspense>
			</div>
			<Footer/>
		</div>
	)
}