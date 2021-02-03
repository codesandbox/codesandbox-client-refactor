import { Factory, Feature, TFeature } from "reactive-app"

import type { Auth } from "../Auth"

export interface Home extends Feature, Factory {}

export class Home {
  static mixins = ["Feature", "Factory"]
  readonly auth!: TFeature<typeof Auth>

  constructor() {
    this.injectFeatures({
      auth: "Auth",
    })
  }
}
