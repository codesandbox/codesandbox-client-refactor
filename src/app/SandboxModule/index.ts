import { Factory, Feature, TFeature } from "reactive-app"

import { IModuleDTO, SandboxApi } from "../SandboxApi"

export interface SandboxModule extends Feature, Factory {}

export class SandboxModule {
  static mixins = ["Feature", "Factory"]
  readonly sandboxApi!: TFeature<typeof SandboxApi>

  constructor(moduleDTO: IModuleDTO) {
    this.injectFeatures({
      sandboxApi: "SandboxApi",
    })
  }
}
