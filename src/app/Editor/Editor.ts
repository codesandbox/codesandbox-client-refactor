import { Factory, Feature, StateMachine, TFeature } from "reactive-app"

import type { Auth } from "../Auth"
import type { ISandboxDTO, SandboxApi } from "../SandboxApi"

/*
  - Make feature folders instead of files
  - Fix inserting properties with capabilities related to constructor etc.
*/

export type TMessage =
  | { type: "SANDBOX_LOADED"; sandbox: ISandboxDTO }
  | { type: "SANDBOX_ERROR"; error: string }

export type TContext =
  | { state: "PENDING" }
  | { state: "READY" }
  | { state: "ERROR"; error: string }

export interface Editor
  extends Feature,
    Factory,
    StateMachine<TMessage, TContext> {}

export class Editor {
  static mixins = ["Feature", "Factory", "StateMachine"]
  readonly sandboxApi!: TFeature<typeof SandboxApi>

  readonly auth!: TFeature<typeof Auth>

  private sandboxId: string

  context: TContext = { state: "PENDING" }

  constructor(sandboxId: string) {
    this.injectFeatures({
      auth: "Auth",
      sandboxApi: "SandboxApi",
    })
    this.makeObservable({
      context: "observable",
    })

    this.sandboxId = sandboxId

    this.when(
      () =>
        this.auth.context.state === "AUTHENTICATED" ||
        this.auth.context.state === "UNAUTHENTICATED",
      this.onAuth.bind(this)
    )
  }

  private async onAuth() {
    try {
      const sandbox = await this.resolve(
        this.sandboxApi.getSandbox(this.sandboxId)
      )
      this.send({ type: "SANDBOX_LOADED", sandbox })
    } catch (error) {
      if (this.isDisposed()) {
        return
      }

      this.send({ type: "SANDBOX_ERROR", error: error.message })
    }
  }

  protected onMessage(message: TMessage): TContext | void {
    switch (message.type) {
      case "SANDBOX_LOADED": {
        if (this.context.state === "PENDING") {
          return { state: "READY" }
        }
        break
      }
      case "SANDBOX_ERROR": {
        if (this.context.state === "PENDING") {
          return { state: "ERROR", error: message.error }
        }
        break
      }
    }
  }
}
