import { useSearchParams } from "react-router-dom"
import { useEffect } from "react"
import { useToken } from "../hooks/useToken.ts"
import { useRest } from "../hooks/useRest.ts"
import { CircularProgress } from "@nextui-org/react"
import { useNavigate } from "react-router"

export default function OAuth2Page() {
	const navigate = useNavigate()

	const [ params ] = useSearchParams()
	const code = params.get("code")
	const state = params.get("state")

	const { setToken } = useToken()
	const { put: login } = useRest<{ token: string }>("/@me/game", {
		onSuccess: data => {
			setToken(data.token)
			navigate(`/game/${ state }`)
		}
	})

	useEffect(() => {
		login({
			path: `/${ state }`,
			data: {
				code: code
			}
		})
	}, [])

	return <CircularProgress className="m-auto"/>
}