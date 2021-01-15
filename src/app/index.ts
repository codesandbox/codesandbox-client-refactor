import { Container } from "reactive-app"

import { Auth } from "./Auth"
import { Deployment } from "./Deployment"
import { Home } from "./Home"
import { Navigator } from "./Navigator"
import { RestApi } from "./RestApi"
import { Sandbox } from "./Sandbox"
import { SandboxDirectory } from "./SandboxDirectory"
import { SandboxModule } from "./SandboxModule"
import { Browser } from "./Browser"
import { Storage } from "./Storage"
import { GitHub } from "./GitHub"
import { GitHubApi } from "./GitHubApi"

export const container = new Container(
  {
    Sandbox,
    Auth,
    Deployment,
    RestApi,
    SandboxModule,
    SandboxDirectory,
    Navigator,
    Home,
    Browser,
    Storage,
    GitHub,
    GitHubApi,
  },
  {
    devtool:
      process.env.NODE_ENV === "development" ? "localhost:5051" : undefined,
  }
)
