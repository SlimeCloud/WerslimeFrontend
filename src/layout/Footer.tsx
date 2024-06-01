import { Divider, Link } from "@nextui-org/react";
import { NavLink } from "react-router-dom"

export default function Footer() {
	return (
		<footer className="w-full h-[35px] select-none">
			<Divider className="absolute"/>
			<div className="z-40 flex px-6 gap-4 w-full flex-row relative flex-nowrap whitespace-nowrap items-center justify-between h-full max-w-full">
				<div className="flex gap-5 justify-between w-full sm:w-fit">
					<span>© 2024 { import.meta.env._OWNER }</span>
					<NavLink className="hover:opacity-80" to="/impressum">Impressum</NavLink>
				</div>

				<Link className="hidden sm:flex text-foreground" showAnchorIcon target="_blank" href={ `https://github.com/${ import.meta.env._REPOSITORY }` }>{ import.meta.env._REPOSITORY }</Link>
			</div>
		</footer>
	)
}