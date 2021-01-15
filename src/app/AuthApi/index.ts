import { Feature, TFeature } from "reactive-app"

import type { RestApi } from "../RestApi"

export interface ICurrentUserDTO {
  jwt: string
}

export interface AuthApi extends Feature {}

export class AuthApi {
  static mixins = ["Feature"]
  readonly restApi!: TFeature<typeof RestApi>

  constructor() {
    this.injectFeatures({
      restApi: "RestApi",
    })
  }

  signIn() {
    return this.restApi.get<ICurrentUserDTO>("/users/current")
  }

  revokeToken(jwt: string) {}
}
