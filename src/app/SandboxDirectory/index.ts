import { Feature, Factory, TFeature } from "reactive-app"
import type { SandboxApi } from "../SandboxApi"

export interface SandboxDirectory extends Feature, Factory {}

export class SandboxDirectory {
  static mixins = ["Feature", "Factory"]
  readonly sandboxApi!: TFeature<typeof SandboxApi>

  constructor() {
    this.injectFeatures({
      sandboxApi: "SandboxApi",
    })
  }
}
