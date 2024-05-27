import { Link, Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import { NavLink } from "react-router-dom"
import icon from "../assets/icon.png"
import NavEntry from "./NavEntry.tsx";
import { lazy, Suspense } from "react";
import { GameState } from "../types/GameState.ts";
import { useLocation } from "react-router";

const UserInfo = lazy(() => import("./UserInfo.tsx"));

export default function Navigation({ gameState }: { gameState?: GameState }) {
	const { pathname } = useLocation()

	return (
		<Navbar maxWidth="full" height="50px" className="select-none" isBordered>
			<NavbarBrand>
				<Link color="foreground" as="div">
					<NavLink to="/" className="gap-2 relative inline-flex items-center tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-medium text-foreground no-underline hover:opacity-80 active:opacity-disabled transition-opacity">
						<img src={ icon } className="h-[30px]"/>
						<p className="font-bold text-inherit text-lg">{ import.meta.env._TITLE }</p>
					</NavLink>
				</Link>
			</NavbarBrand>

			<NavbarContent className="hidden sm:flex gap-7" justify="center">
				<NavEntry path="/">Startseite</NavEntry>
				<NavEntry path="/instructions">Anleitung</NavEntry>
				<NavEntry path="/games">Öffentlich Runden</NavEntry>
				{ (!!gameState?.game || pathname.startsWith("/game/")) && <NavEntry path={ gameState?.game ? `/game/${ gameState.game.id }` : pathname }>Spiel</NavEntry> }
			</NavbarContent>

			<NavbarContent justify="end">
				<Suspense>
					{ gameState?.game && <UserInfo gameState={ gameState }/> }
				</Suspense>
			</NavbarContent>
		</Navbar>
	)
}