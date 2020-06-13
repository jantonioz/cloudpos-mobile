import { useContext } from 'react'
import { SessionContext } from './SessionContext'


export const useSessionState = () => useContext(SessionContext)