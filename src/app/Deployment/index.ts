import { Feature, Factory } from "reactive-app"

import type { Sandbox } from "../Sandbox"

export interface Deployment extends Feature, Factory {}

export class Deployment {
  static mixins = ["Feature", "Factory"]

  private sandbox: Sandbox

  constructor(sandbox: Sandbox) {
    this.sandbox = sandbox
  }
}
