import { Factory, Feature, TFeature } from "reactive-app"

import type { GitHub } from "../GitHub"
import type { ISandboxDTO, SandboxApi } from "../SandboxApi"
import type { SandboxDirectory } from "../SandboxDirectory"
import type { SandboxModule } from "../SandboxModule"

// This is actually an import
function hasPermission(
  permission: "write" | "read" | "admin",
  sandbox: ISandboxDTO
) {
  return true
}

export interface Sandbox extends Feature, Factory {}

export class Sandbox {
  static mixins = ["Feature", "Factory"]
  readonly createGitHub!: TFeature<typeof GitHub>

  readonly createSandboxDirectory!: TFeature<typeof SandboxDirectory>

  readonly createSandboxModule!: TFeature<typeof SandboxModule>

  readonly sandboxApi!: TFeature<typeof SandboxApi>

  id: ISandboxDTO["id"]
  title: ISandboxDTO["title"]
  alias: ISandboxDTO["alias"]
  description: ISandboxDTO["description"]
  privacy: ISandboxDTO["privacy"]
  modules: SandboxModule[]
  directories: SandboxDirectory[]

  private gitHub?: GitHub

  constructor(sandboxDTO: ISandboxDTO) {
    this.id = sandboxDTO.id
    this.title = sandboxDTO.title
    this.alias = sandboxDTO.alias
    this.description = sandboxDTO.description
    this.privacy = sandboxDTO.privacy
    this.modules = sandboxDTO.modules.map(this.createSandboxModule)

    if (sandboxDTO.originalGit && sandboxDTO.originalGitCommitSha) {
      this.gitHub = this.createGitHub({
        originalGit: sandboxDTO.originalGit,
        originalGitCommitSha: sandboxDTO.originalGitCommitSha,
        baseGit: sandboxDTO.baseGit,
        baseGitCommitSha: sandboxDTO.baseGitCommitSha,
        prNumber: sandboxDTO.prNumber,
      })
    }

    this.makeObservable({
      privacy: "observable",
      description: "observable",
      modules: "observable",
      alias: "observable",
      title: "observable",
      directories: "observable",
    })
    this.injectFeatures({
      sandboxApi: "SandboxApi",
      createSandboxModule: "SandboxModule",
      createSandboxDirectory: "SandboxDirectory",
      createGitHub: "GitHub",
    })
  }

  private hasPermission(permission: Parameters<typeof hasPermission>[0]) {}

  canFork() {
    return this.hasPermission("read")
  }
}
