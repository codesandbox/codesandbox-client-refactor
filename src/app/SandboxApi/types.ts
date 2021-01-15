export type IModuleErrorDTO = {
  message: string
  line: number
  column: number
  title: string
  path: string
  severity: "error" | "warning"
  type: "compile" | "dependency-not-found" | "no-dom-change"
  source: string | undefined
  payload?: Object
  columnEnd?: number
  lineEnd?: number
}

export type IModuleCorrectionDTO = {
  message: string
  line: number
  column: number
  lineEnd?: number
  columnEnd?: number
  source: string | undefined
  path: string | undefined
  severity: "notice" | "warning"
}

export type TPermissionType =
  | "owner"
  | "write_code"
  | "write_project"
  | "comment"
  | "read"
  | "none"

export interface IModuleDTO {
  id: string
  title: string
  code: string
  savedCode: string | null
  shortid: string
  errors: IModuleErrorDTO[]
  corrections: IModuleCorrectionDTO[]
  directoryShortid: string | null
  isNotSynced: boolean
  sourceId: string
  isBinary: boolean
  insertedAt: string
  updatedAt: string
  path: string
  uploadId?: string
  sha?: string
  type: "file"
}

export interface IGitInfoDTO {
  repo: string
  username: string
  path: string
  branch: string
  commitSha: string | null
}

export interface IForkedSandboxDTO {
  id: string
  alias: string | null
  title: string | null
  customTemplate: ICustomTemplateDTO | null
  insertedAt: string
  updatedAt: string
  template: string
  privacy: 0 | 1 | 2
  git: IGitInfoDTO | null
}

export interface IDirectoryDTO {
  id: string
  title: string
  directoryShortid: string | null
  shortid: string
  path: string | null
  sourceId: string
  type: "directory"
}

export interface INpmRegistryDTO {
  enabledScopes: string[]
  limitToScopes: boolean
  registryUrl: string
}

export interface ICustomTemplateDTO {
  color?: string
  iconUrl?: string
  id: string
  published?: boolean
  title: string
  url: string | null
}

export type TTemplateType =
  | "adonis"
  | "create-react-app"
  | "vue-cli"
  | "preact-cli"
  | "svelte"
  | "create-react-app-typescript"
  | "angular-cli"
  | "parcel"
  | "cxjs"
  | "@dojo/cli-create-app"
  | "gatsby"
  | "marko"
  | "nuxt"
  | "next"
  | "reason"
  | "apollo"
  | "sapper"
  | "nest"
  | "static"
  | "styleguidist"
  | "gridsome"
  | "vuepress"
  | "mdx-deck"
  | "quasar-framework"
  | "unibit"
  | "node"
  | "ember"
  | "custom"
  | "babel-repl"

export interface IBadgeDTO {
  id: string
  name: string
  visible: boolean
}

export interface ISandboxAuthorDTO {
  id: string
  username: string
  name: string
  avatarUrl: string
  badges: IBadgeDTO[]
  subscriptionSince: string | null
  subscriptionPlan: "pro" | "patron"
  personalWorkspaceId: string
}

export interface ISandboxDTO {
  id: string
  alias: string | null
  title: string | null
  description: string
  viewCount: number
  likeCount: number
  forkCount: number
  userLiked: boolean
  modules: IModuleDTO[]
  directories: IDirectoryDTO[]
  npmRegistries: INpmRegistryDTO[]
  featureFlags: {
    [key: string]: boolean
  }
  collection?: {
    path: string
  }
  owned: boolean
  authorization: TPermissionType
  npmDependencies: {
    [dep: string]: string
  }
  customTemplate: ICustomTemplateDTO | null
  /**
   * Which template this sandbox is based on
   */
  forkedTemplate: ICustomTemplateDTO | null
  /**
   * Sandbox the forked template is from
   */
  forkedTemplateSandbox: IForkedSandboxDTO | null
  externalResources: string[]
  team: {
    id: string
    name: string
    avatarUrl: string | undefined
  } | null
  roomId: string | null
  privacy: 0 | 1 | 2
  author: ISandboxAuthorDTO | null
  forkedFromSandbox: IForkedSandboxDTO | null
  git: IGitInfoDTO | null
  tags: string[]
  isFrozen: boolean
  isSse?: boolean
  alwaysOn: boolean
  environmentVariables: {
    [key: string]: string
  } | null
  /**
   * This is the source it's assigned to, a source contains all dependencies, modules and directories
   *
   * @type {string}
   */
  sourceId: string
  source?: {
    template: string
  }
  template: TTemplateType
  entry: string
  originalGit: IGitInfoDTO | null
  baseGit: IGitInfoDTO | null
  prNumber: number | null
  originalGitCommitSha: string | null
  baseGitCommitSha: string | null
  originalGitChanges: {
    added: string[]
    modified: string[]
    deleted: string[]
    rights: "none" | "read" | "write" | "admin"
  } | null
  version: number
  screenshotUrl: string | null
  previewSecret: string | null
}
