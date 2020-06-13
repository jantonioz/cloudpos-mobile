import React, { useReducer } from 'react'
import { SessionActions, SessionState, SessionContext } from './SessionContext'
import moment from 'moment'

const reducer = (state: SessionState, action: SessionActions) => {
  switch (action.type) {
    case 'setTokenRef': return { ...state, token: action.token }
    case 'resetToken': return { ...state, token: '' }
    default: return state
  }
}

const initialState: SessionState = {
  token: '', host: ''
}

export function SessionProvider({ children }: any) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const sessionState = state
  const setSessionState = dispatch

  return <SessionContext.Provider value={{ sessionState, setSessionState }}>
    {children}
  </SessionContext.Provider>
}