import * as React from "react"

import { useContainer } from "../provider"
import type { Auth } from "./"

const context = React.createContext<Auth>(null as any)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const container = useContainer()
  const auth = container.get("Auth") as Auth

  return <context.Provider value={auth}>{children}</context.Provider>
}

export const useAuth = () => {
  return React.useContext(context)
}
