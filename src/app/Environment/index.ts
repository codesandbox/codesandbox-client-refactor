import { Feature } from "reactive-app"

export enum Env {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

declare var process: { env: { NODE_ENV: Env } }

export interface Environment extends Feature {}

export class Environment {
  static mixins = ["Feature"]

  apiEndpoint: string
  useDevelopmentAuthentication: boolean
  authenticationEndpoint: string
  authenticationCliEndpoint: string

  constructor() {
    switch (process.env.NODE_ENV) {
      case Env.DEVELOPMENT: {
        this.apiEndpoint = "https://codesandbox.io/api"
        this.useDevelopmentAuthentication = true
        this.authenticationEndpoint = `${location.origin}/auth/dev?version=2`
        this.authenticationCliEndpoint = "https://codesandbox.io/cli/login"
        break
      }
      case Env.PRODUCTION: {
        this.apiEndpoint = "https://codesandbox.io/api"
        this.useDevelopmentAuthentication = false
        this.authenticationEndpoint = `${location.origin}/auth/github?version=2`
        this.authenticationCliEndpoint = "https://codesandbox.io/cli/login"
        break
      }
    }
  }
}
