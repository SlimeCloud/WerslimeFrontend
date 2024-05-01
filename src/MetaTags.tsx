const GAME_PATTERN = /(\/game\/[a-zA-Z0-9]+)|(\/join\?token=.*)/

export default function MetaTags({ url }:  { url: string }) {
	const path = url.replace(import.meta.env._BASE, "")

	const game = GAME_PATTERN.test(path)

	return (
		<>
			<title>{ import.meta.env._TITLE }</title>

			<meta name="theme-color" content={ `#${ import.meta.env._THEME }` }/>
			<meta name="og:image" content={ `${ import.meta.env._URL }/favicon.png` }/>

			{ game ? <link rel="alternate" type="application/json+oembed" href={ `${ import.meta.env._API }/oembed?url=${ encodeURIComponent(import.meta.env._URL + path) }&format=json` }/> : <>
				<meta name="og:title" content={ `${ import.meta.env._TITLE }${ game ? " Runde" : "" }` }/>
				<meta name="og:description" content={ `Spiele Werslime auf ${ import.meta.env._HOST }` }/>
			</> }
		</>
	)
}