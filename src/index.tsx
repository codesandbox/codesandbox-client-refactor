import * as React from "react"
import { render } from "react-dom"

import { container } from "./app"
import { ContainerProvider } from "./app/provider"
import { App } from "./components/App"

render(
  <ContainerProvider value={container}>
    <App />
  </ContainerProvider>,
  document.querySelector("#app")
)
