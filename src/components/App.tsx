import * as React from "react"

import { AuthProvider } from "../app/auth/provider"
import { NavigatorProvider } from "../app/navigator/provider"
import { Navigator } from "./Navigator"

export const App = () => {
  return (
    <NavigatorProvider>
      <AuthProvider>
        <Navigator />
      </AuthProvider>
    </NavigatorProvider>
  )
}
