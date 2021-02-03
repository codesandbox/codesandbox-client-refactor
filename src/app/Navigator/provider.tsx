import * as React from "react"

import { createProvider } from "../../utils/createProvider"
import { useContainer } from "../provider"
import type { Navigator } from "./"

const { Component, hook } = createProvider<Navigator>(
  (Provider) => ({ children }) => {
    const container = useContainer()
    const navigator = container.get("Navigator") as Navigator

    return <Provider value={navigator}>{children}</Provider>
  }
)

export const NavigatorProvider = Component

export const useNavigator = hook
