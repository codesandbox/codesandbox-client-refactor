import * as React from "react"

import { useAuth } from "../app/auth/provider"
import { useNavigator } from "../app/navigator/provider"

export const Navigator = () => {
  const navigator = useNavigator()
  const auth = useAuth()

  if (navigator.context.state === "HOME") {
    return (
      <div>
        <h1>Hello from Home</h1>
        <button onClick={() => auth.signIn()}>Sign In</button>
      </div>
    )
  }

  if (navigator.context.state === "EDITOR") {
    return <h1>Hello from Editor</h1>
  }

  if (navigator.context.state === "DEVELOPMENT_AUTHENTICATION") {
    return <h1>Hello from Development Authentication</h1>
  }

  return null
}
