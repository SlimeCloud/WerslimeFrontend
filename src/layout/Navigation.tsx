import { Link, Navbar, NavbarBrand, NavbarContent, Switch } from "@nextui-org/react";
import icon from "../assets/icon.png"
import NavEntry from "./NavEntry.tsx";
import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode.ts";
import { useEffect } from "react";
import { GameState } from "../types/GameState.ts";
import { useLocation } from "react-router";
import UserInfo from "./UserInfo.tsx";

export default function Navigation({ gameState }: { gameState?: GameState }) {
	const { pathname } = useLocation()
	const { darkMode, setDarkMode } = useDarkMode()

	useEffect(() => {
		if(darkMode) document.body.classList.add("dark")
		else document.body.classList.remove("dark")
	}, [ darkMode ])

	return (
		<Navbar maxWidth="full" height="50px" className="select-none" isBordered>
			<NavbarBrand>
				<Link className="gap-1" color="foreground" href="/">
					<img src={ icon } className="w-[35px]"/>
					<p className="font-bold text-inherit text-lg">{ import.meta.env._TITLE }</p>
				</Link>
			</NavbarBrand>

			<NavbarContent className="hidden sm:flex gap-7" justify="center">
				<NavEntry path="/">Startseite</NavEntry>
				<NavEntry path="/instructions">Anleitung</NavEntry>
				<NavEntry path="/games">Öffentlich Runden</NavEntry>
				{ (!!gameState?.game || pathname.startsWith("/game/")) && <NavEntry path={ gameState?.game ? `/game/${ gameState.game.id }` : pathname }>Spiel</NavEntry> }
			</NavbarContent>

			<NavbarContent justify="end">
				<Switch
					size="md" color="success"
					startContent={ <Sun/> }
					endContent={ <Moon/> }
					isSelected={ darkMode } onValueChange={ setDarkMode }
				/>
				{ gameState?.game && <UserInfo gameState={ gameState }/> }
			</NavbarContent>
		</Navbar>
	)
}