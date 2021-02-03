import * as React from "react"

import { createProvider } from "../../utils/createProvider"
import { useContainer } from "../provider"
import type { Environment } from "./"

const { Component, hook } = createProvider<Environment>(
  (Provider) => ({ children }) => {
    const container = useContainer()
    const environment = container.get("Environment") as Environment

    return <Provider value={environment}>{children}</Provider>
  }
)

export const EnvironmentProvider = Component

export const useEnvironment = hook
