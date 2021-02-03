import { Feature, Factory } from "reactive-app"

export interface CliLogin extends Feature, Factory {}

export class CliLogin {
  static mixins = ["Feature", "Factory"]
}
