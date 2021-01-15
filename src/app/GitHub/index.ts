import { Factory, Feature, TFeature } from "reactive-app"

import type { GitHubApi } from "../GitHubApi"
import { IGitInfoDTO } from "../SandboxApi"

export interface GitHub extends Feature, Factory {}

export class GitHub {
  static mixins = ["Feature", "Factory"]
  readonly gitHubApi!: TFeature<typeof GitHubApi>

  constructor(data: {
    originalGit: IGitInfoDTO
    originalGitCommitSha: string
    baseGit: IGitInfoDTO | null
    prNumber: number | null
    baseGitCommitSha: string | null
  }) {
    this.injectFeatures({
      gitHubApi: "GitHubApi",
    })
  }
}
