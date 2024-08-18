import { createRoot } from 'react-dom/client'
import App from "./App.tsx"
import { BrowserRouter } from "react-router-dom"

declare global {
	interface Window {
		callRest: (path: string, method: string, body?: object) => void
	}
}

window.callRest = async function request(path: string, method: string, body?: object) {
	const token = localStorage.getItem("token")
	await fetch(`${ import.meta.env._API }${ path }`, {
		method: method,
		body: body && JSON.stringify(body),
		headers: {
			Authorization: token&& JSON.parse(token)
		}
	})
}

createRoot(document.getElementById("root")!).render(
	<BrowserRouter basename={ import.meta.env._BASE }>
		<App/>
	</BrowserRouter>
)