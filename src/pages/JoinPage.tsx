import { useSearchParams } from "react-router-dom"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import { jwtDecode } from "jwt-decode"
import { useToken } from "../hooks/useToken.ts"
import { CircularProgress } from "@nextui-org/react"

export default function JoinPage() {
	const navigate = useNavigate()
	const { setToken } = useToken()

	const [ params ] = useSearchParams()
	const token = params.get("token")

	useEffect(() => {
		if(!token) return

		const game = jwtDecode<{ game: string }>(token).game

		setToken(token)
		navigate(`/game/${ game }`)
	}, [ token ])

	return <CircularProgress className="m-auto"/>
}