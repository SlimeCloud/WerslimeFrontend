import { useEffect, useRef, useState } from "react";
import { ErrorResponse } from "../types/ErrorResponse.ts";
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
	set: (data?: T, error?: ErrorResponse) => void
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

export interface RestOptions {

}

export function useRest<T>(route: string, {
	parser = res => res.text().then(t => t && JSON.parse(t)),
	auto = false,
	cache = true,
	timeout = 10,
	delay = 0,
	onError,
	onSuccess
}: {
	parser?: (res: Response) => Promise<T>
	auto?: boolean,
	cache?: boolean,
	timeout?: number,
	delay?: number,
	onError?: (error: ErrorResponse) => void,
	onSuccess?: (data: T) => void
} = {}): RestRoute<T> {
	const abort = useRef<AbortController>()
	const { token } = useToken()

	const [ state, setState ] = useState<RequestState>(auto ? "loading" : "idle")
	const [ data, setData ] = useState<T | undefined>(undefined)
	const [ error, setError ] = useState<ErrorResponse | undefined>(undefined)

	function execute(method: string, request: Request) {
		const controller = new AbortController()
		abort.current = controller

		const signal = anySignal([ controller.signal, AbortSignal.timeout(timeout * 1000) ])

		setState("loading")

		if(!cache) {
			setData(undefined)
			setError(undefined)
		}

		setTimeout(() => fetch(`${ import.meta.env._API }${ route }${ request.path || "" }`, {
			signal: signal,
			method: method,
			body: request.data && JSON.stringify(request.data),
			headers: {
				Authorization: token || ""
			}
		}).then(res => {
			if(res.ok) {
				parser(res).then(data => {
					setState("success")
					setError(undefined)
					setData(data)

					if(onSuccess) onSuccess(data)
				})
			} else {
				res.json().then(data => {
					setState("error")
					setError(data as ErrorResponse)
					setData(undefined)

					if(onError) onError(data)
				})
			}
		}).catch(() => {
			if(signal.reason === "Cancel") setState("idle")
			else {
				setState("error")

				const error = { status: 0, type: "TIMEOUT" } as ErrorResponse
				setError(error)
				if(onError) onError(error)
			}
		}), delay * 1000)
	}

	useEffect(() => {
		if(auto) execute("GET", {})
	}, [ auto, token ])

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
		cancel: () => abort.current?.abort("Cancel"),
		set: (data, error) => {
			if(data) {
				setData(data)
				setError(undefined)
				setState("success")
			} else if(error) {
				setData(undefined)
				setError(error)
				setState("error")
			} else {
				setData(undefined)
				setError(undefined)
				setState("idle")
			}
		}
	}
}