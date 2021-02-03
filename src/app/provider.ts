import * as React from "react"
import { Container } from "reactive-app"

const context = React.createContext<Container<any>>(null as any)

export const ContainerProvider = context.Provider

export const useContainer = () => React.useContext(context)
