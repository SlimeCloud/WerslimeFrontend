import { Navbar, NavbarBrand, NavbarContent, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { Link } from "react-router-dom"
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
				{ window.innerWidth >= 640 ?
					<Link to="/" className="gap-2 relative inline-flex items-center text-medium text-foreground no-underline hover:opacity-80 active:opacity-disabled transition-opacity">
						<img src={ icon } className="h-[30px]"/>
						<p className="font-bold text-inherit text-lg">{ import.meta.env._TITLE }</p>
					</Link> :
					<Popover placement="bottom-start">
						<PopoverTrigger>
							<button className="gap-2 relative inline-flex items-center tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-medium text-foreground no-underline hover:opacity-80 active:opacity-disabled transition-opacity">
								<img src={ icon } className="h-[30px]"/>
								<p className="font-bold text-inherit text-lg">{ import.meta.env._TITLE }</p>
							</button>
						</PopoverTrigger>
						<PopoverContent>
							<ul className="flex flex-col gap-2 text-left">
								<NavEntry path="/">Startseite</NavEntry>
								<NavEntry path="/instructions">Anleitung</NavEntry>
								<NavEntry path="/games">Öffentlich Runden</NavEntry>
								{ (!!gameState?.game || pathname.startsWith("/game/")) && <NavEntry path={ gameState?.game ? `/game/${ gameState.game.id }` : pathname }>Spiel</NavEntry> }
							</ul>
						</PopoverContent>
					</Popover>
				}
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