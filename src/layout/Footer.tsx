import { Divider, Link } from "@nextui-org/react";

export default function Footer() {
	return (
		<footer className="w-full h-[35px]">
			<Divider className="absolute"/>
			<div className="z-40 flex px-6 gap-4 w-full flex-row relative flex-nowrap whitespace-nowrap items-center justify-between h-full max-w-full">
				<span className="justify-start">© 2024 { import.meta.env._OWNER }</span>
				<span className="justify-end"><Link className="text-foreground hover:underline" target="_blank" href={ `https://github.com/${ import.meta.env._REPOSITORY }` }>{ import.meta.env._REPOSITORY }</Link></span>
			</div>
		</footer>
	)
}