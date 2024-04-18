import { Link, Navbar, NavbarBrand, NavbarContent, Switch } from "@nextui-org/react";
import icon from "../assets/icon.svg"
import NavEntry from "./NavEntry.tsx";
import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode.ts";
import { useEffect } from "react";

export default function Navigation() {
	const { darkMode, setDarkMode } = useDarkMode()

	useEffect(() => {
		if(darkMode) document.body.classList.add("dark")
		else document.body.classList.remove("dark")
	}, [ darkMode ])

	return (
		<Navbar maxWidth="full" height="50px" isBordered>
			<NavbarBrand>
				<Link className="gap-2" color="foreground" href="/">
					<img src={ icon }/>
					<p className="font-bold text-inherit">{ import.meta.env._TITLE }</p>
				</Link>
			</NavbarBrand>

			<NavbarContent className="hidden sm:flex gap-7" justify="center">
				<NavEntry path="/">Home</NavEntry>
				<NavEntry path="/test">Test</NavEntry>
				<NavEntry path="/abc">Abc</NavEntry>
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