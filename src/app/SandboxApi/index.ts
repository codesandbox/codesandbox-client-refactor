import { Feature, TFeature } from "reactive-app"

import type { RestApi } from "../RestApi"
import { ISandboxDTO } from "./types"

export * from "./types"

export interface SandboxApi extends Feature {}

export class SandboxApi {
  static mixins = ["Feature"]
  readonly restApi!: TFeature<typeof RestApi>

  constructor() {
    this.injectFeatures({
      restApi: "RestApi",
    })
  }

  getSandbox(sandboxId: string) {
    return this.restApi.get<ISandboxDTO>(`/s/${sandboxId}`)
  }
}
