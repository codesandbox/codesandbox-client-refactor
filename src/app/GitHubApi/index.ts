import { Feature, TFeature } from "reactive-app"
import type { RestApi } from "../RestApi"

export interface GitHubApi extends Feature {}

export class GitHubApi {
  static mixins = ["Feature"]
  readonly restApi!: TFeature<typeof RestApi>

  constructor() {
    this.injectFeatures({
      restApi: "RestApi",
    })
  }
}
