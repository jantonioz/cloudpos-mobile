import React, { createContext } from 'react'

export type SessionState = {
	token: String,
	host: String,
}

export type SessionActions =
	| {
			type: 'setTokenRef'
			token: String
	  }
	| {
			type: 'resetToken'
	  }

export const initialSessionContext: {
	sessionState: SessionState
	setSessionState: React.Dispatch<SessionActions>
} = {
	sessionState: { token: '', host: '' },
	setSessionState: () => {}
}

export const SessionContext = createContext(initialSessionContext)