export type ErrorResponseType =
	"UNKNOWN" |
	"TIMEOUT" |

	"INVALID_REQUEST" |

	"MISSING_TOKEN" |
	"INVALID_TOKEN" |
	"TOKEN_EXPIRED" |
	"MISSING_ACCESS" |

	"GAME_NOT_FOUND" |
	"INVALID_GAME_STATE" |

	"INVALID_TARGET" |
	"INVALID_TURN" |
	"ACTION_UNAVAILABLE"

export interface ErrorResponse {
	status: number,
	type: ErrorResponseType
}