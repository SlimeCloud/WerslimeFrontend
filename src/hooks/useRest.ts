import { useCallback, useEffect, useRef, useState } from "react";
import { ErrorResponse } from "./ErrorResponse.ts";
import { useToken } from "./useToken.ts";

export type RequestState = "success" | "error" | "idle" | "loading"

export interface Request {
	path?: string
	data?: object
}

export interface RestRoute<T> {
	state: RequestState
	data?: T
	error?: ErrorResponse

	get: (data?: Request) => void
	post: (data?: Request) => void
	put: (data?: Request) => void
	delete: (data?: Request) => void

	reset: () => void
	cancel: () => void
}


function anySignal(signals: AbortSignal[]) {
	const controller = new AbortController()

	function onAbort(reason: string) {
		controller.abort(reason)

		for(const signal of signals) {
			signal.removeEventListener('abort', () => onAbort(signal.reason))
		}
	}

	for(const signal of signals) {
		if(signal.aborted) {
			onAbort(signal.reason)
			break
		}

		signal.addEventListener('abort', () => onAbort(signal.reason))
	}

	return controller.signal
}

export function useRest<T>(route: string, {
	parser = res => res.json(),
	auto = false,
	cache = true,
	timeout = 10
}: {
	parser?: (res: Response) => Promise<T>
	auto?: boolean,
	cache?: boolean,
	timeout?: number
}): RestRoute<T> {
	const abort = useRef<AbortController>()
	const { token } = useToken()

	const [ state, setState ] = useState<RequestState>(auto ? "loading" : "idle")
	const [ data, setData ] = useState<T | undefined>(undefined)
	const [ error, setError ] = useState<ErrorResponse | undefined>(undefined)

	const execute = useCallback((method: string, request: Request) => {
		const controller = new AbortController()
		abort.current = controller

		const signal = anySignal([ controller.signal, AbortSignal.timeout(timeout * 1000) ])

		setState("loading")

		if(!cache) {
			setData(undefined)
			setError(undefined)
		}

		fetch(`${ import.meta.env._API }${ route }${ request.path || "" }`, {
			signal: signal,
			method: method,
			body: data && JSON.stringify(data),
			headers: {
				Authorization: token || ""
			}
		}).then(res => {
			if(res.ok) {
				parser(res).then(data => {
					setState("success")
					setError(undefined)
					setData(data)
				})
			} else {
				res.json().then(data => {
					setState("error")
					setError((data as { type: ErrorResponse }).type)
					setData(undefined)
				})
			}
		}).catch(() => {
			if(signal.reason === "Cancel") setState("idle")
			else {
				setState("error")
				setError("TIMEOUT")
			}
		})
	}, [ cache, parser, route, timeout, token ])

	useEffect(() => {
		if(auto) execute("GET", {})
	}, [ auto, execute, token ])

	function reset() {
		setState(auto ? "loading" : "idle")
		setData(undefined)
		setError(undefined)

		if(auto) execute("GET", {})
	}

	return {
		state: state,
		data: data,
		error: error,

		get: (request: Request = {}) => execute("GET", request),
		put: (request: Request = {}) => execute("PUT", request),
		post: (request: Request = {}) => execute("POST", request),
		delete: (request: Request = {}) => execute("DELETE", request),

		reset: reset,
		cancel: () => abort.current?.abort("Cancel")
	}
}