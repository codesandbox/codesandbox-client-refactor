import { Feature, StateMachine, TFeature } from "reactive-app"

import type { Editor } from "../Editor"
import type { Home } from "../Home"

export type TContext =
  | { state: "HOME"; home: Home }
  | { state: "EDITOR"; editor: Editor }

export type TEvent =
  | { type: "HOME_ROUTED" }
  | { type: "EDITOR_ROUTED"; id: string }

export interface Navigator extends Feature, StateMachine<TContext, TEvent> {}

export class Navigator {
  static mixins = ["Feature", "StateMachine"]
  readonly createHome!: TFeature<typeof Home>

  readonly createEditor!: TFeature<typeof Editor>

  context: TContext

  constructor() {
    this.injectFeatures({
      createEditor: "Editor",
      createHome: "Home",
    })

    this.context = { state: "HOME", home: this.createHome() }

    this.makeObservable({
      context: "observable",
    })
  }

  protected onEvent(event: TEvent): TContext | void {
    switch (event.type) {
      case "HOME_ROUTED": {
        return { state: "HOME", home: this.createHome() }
      }
      case "EDITOR_ROUTED": {
        return { state: "EDITOR", editor: this.createEditor(event.id) }
      }
    }
  }

  home() {
    return this.send({ type: "HOME_ROUTED" })
  }

  editor(id: string) {
    return this.send({ type: "EDITOR_ROUTED", id })
  }
}
