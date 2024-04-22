import { EventSourceContext } from "../hooks/useEvent.ts";
import { useToken } from "../hooks/useToken.ts";
import { ReactNode, useEffect, useMemo } from "react";

export default function EventProvider({ route, children }: { route: string, children?: ReactNode }) {
	const { token } = useToken()

	const source = useMemo(() => {
		return new WebSocket(`${ import.meta.env._API }${ route }?token=${ token }`)
	}, [ route, token ])

	useEffect(() => {
		return () => source.close()
	}, [ source ]);

	return (
		<>
			<EventSourceContext.Provider value={ source }>
				{ children }
			</EventSourceContext.Provider>
		</>
	)
}