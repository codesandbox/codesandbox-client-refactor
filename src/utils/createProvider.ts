import * as React from "react"

export const createProvider = <T>(
  cb: (provider: React.Provider<T>) => React.FC
) => {
  const context = React.createContext<T>(null as any)
  const Component = cb(context.Provider)

  const hook = () => {
    try {
      return React.useContext(context)
    } catch {
      throw new Error(`This Feature is not exposed on the React context`)
    }
  }
  return {
    Component,
    hook,
  }
}
