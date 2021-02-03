import { Container } from "reactive-app"

import { Auth } from "./Auth"
import { Browser } from "./Browser"
import { Deployment } from "./Deployment"
import { Environment } from "./Environment"
import { GitHub } from "./GitHub"
import { GitHubApi } from "./GitHubApi"
import { Home } from "./Home"
import { Navigator } from "./Navigator"
import { RestApi } from "./RestApi"
import { Sandbox } from "./Sandbox"
import { SandboxDirectory } from "./SandboxDirectory"
import { SandboxModule } from "./SandboxModule"
import { Storage } from "./Storage"
import { CliLogin } from "./CliLogin"
import { DevelopmentAuthentication } from "./DevelopmentAuthentication"

export const container = new Container(
  {
    Sandbox,
    Auth,
    Deployment,
    RestApi,
    Environment,
    SandboxModule,
    SandboxDirectory,
    Navigator,
    Home,
    Browser,
    Storage,
    GitHub,
    GitHubApi,
    CliLogin,
    DevelopmentAuthentication,
  },
  {
    devtool:
      process.env.NODE_ENV === "development" && !window.opener
        ? "localhost:5051"
        : undefined,
  }
)
