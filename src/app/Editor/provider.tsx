import * as React from "react"

import { createProvider } from "../../utils/createProvider"
import { useNavigator } from "../navigator/provider"
import { useContainer } from "../provider"
import type { Editor } from "./"

const { Component, hook } = createProvider<Editor>(
  (Provider) => ({ children }) => {
    const navigator = useNavigator()

    if (navigator.context.state === "EDITOR") {
      return <Provider value={navigator.context.editor}>{children}</Provider>
    }

    throw new Error("The application is not in an EDITOR state")
  }
)

export const EditorProvider = Component

export const useEditor = hook
