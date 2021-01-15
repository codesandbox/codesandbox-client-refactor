import { Factory, Feature, StateMachine, TFeature } from "reactive-app"

import type { Auth } from "../Auth"
import type { Deployment } from "../Deployment"
import type { Sandbox } from "../Sandbox"
import type { ISandboxDTO, SandboxApi } from "../SandboxApi"

/*
  - Make feature folders instead of files
  - Fix inserting properties with capabilities related to constructor etc.
*/

export type TContext =
  | { state: "PENDING" }
  | { state: "READY"; sandbox: Sandbox; deployment: Deployment }
  | { state: "ERROR"; error: string }

export type TEvent =
  | { type: "SANDBOX_LOADED"; sandboxDTO: ISandboxDTO }
  | { type: "SANDBOX_ERROR"; error: string }

export interface Editor
  extends Feature,
    Factory,
    StateMachine<TContext, TEvent> {}

export class Editor {
  static mixins = ["Feature", "Factory", "StateMachine"]
  readonly createDeployment!: TFeature<typeof Deployment>

  readonly createSandbox!: TFeature<typeof Sandbox>

  readonly sandboxApi!: TFeature<typeof SandboxApi>

  readonly auth!: TFeature<typeof Auth>

  private sandboxId: string

  context: TContext = { state: "PENDING" }

  constructor(sandboxId: string) {
    this.injectFeatures({
      auth: "Auth",
      sandboxApi: "SandboxApi",
      createSandbox: "Sandbox",
      createDeployment: "Deployment",
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

  protected onEvent(event: TEvent): TContext | void {
    return this.transition(this.context, event, {
      PENDING: {
        SANDBOX_LOADED: ({ sandboxDTO }) => {
          const sandbox = this.createSandbox(sandboxDTO)

          return {
            state: "READY",
            sandbox,
            deployment: this.createDeployment(sandbox),
          }
        },
        SANDBOX_ERROR: ({ error }) => ({ state: "ERROR", error }),
      },
      ERROR: {},
      READY: {},
    })
  }

  private async onAuth() {
    try {
      const sandboxDTO = await this.resolve(
        this.sandboxApi.getSandbox(this.sandboxId)
      )
      this.send({ type: "SANDBOX_LOADED", sandboxDTO })
    } catch (error) {
      this.send({ type: "SANDBOX_ERROR", error: error.message })
    }
  }
}
