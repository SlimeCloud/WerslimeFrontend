import { Link, Navbar, NavbarBrand, NavbarContent, Switch } from "@nextui-org/react";
import icon from "../assets/icon.png"
import NavEntry from "./NavEntry.tsx";
import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode.ts";
import { useEffect } from "react";
import { useGameState } from "../hooks/useGameState.ts";

export default function Navigation() {
	const { darkMode, setDarkMode } = useDarkMode()
	const gameState = useGameState()

	useEffect(() => {
		if(darkMode) document.body.classList.add("dark")
		else document.body.classList.remove("dark")
	}, [ darkMode ])

	return (
		<Navbar maxWidth="full" height="50px" className="select-none" isBordered>
			<NavbarBrand>
				<Link className="gap-1" color="foreground" href="/">
					<img src={ icon } className="w-[30px]"/>
					<p className="font-bold text-inherit">{ import.meta.env._TITLE }</p>
				</Link>
			</NavbarBrand>

			<NavbarContent className="hidden sm:flex gap-7" justify="center">
				<NavEntry path="/">Startseite</NavEntry>
				<NavEntry path="/instructions">Anleitung</NavEntry>
				{ gameState?.game && <NavEntry path={ `/game/${ gameState.game.id }` }>Spiel</NavEntry> }
			</NavbarContent>

			<NavbarContent justify="end">
				<Switch
					size="md" color="success"
					startContent={ <Sun/> }
					endContent={ <Moon/> }
					isSelected={ darkMode } onValueChange={ setDarkMode }
				/>
			</NavbarContent>
		</Navbar>
	)
}