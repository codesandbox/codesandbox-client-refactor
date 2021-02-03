import Navigo from "navigo"
import { Feature, StateMachine, TFeature } from "reactive-app"

import type { CliLogin } from "../CliLogin"
import type { Editor } from "../Editor"
import type { Home } from "../Home"
import type { DevelopmentAuthentication } from "../DevelopmentAuthentication"

export enum Page {
  HOME = "HOME",
  EDITOR = "EDITOR",
  DEVELOPMENT_AUTHENTICATION = "DEVELOPMENT_AUTHENTICATION",
  CLI_LOGIN = "CLI_LOGIN",
}

export type Route =
  | {
      name: Page.HOME
    }
  | {
      name: Page.EDITOR
      params: { id: string }
    }
  | {
      name: Page.DEVELOPMENT_AUTHENTICATION
    }
  | {
      name: Page.CLI_LOGIN
    }

export type TContext =
  | { state: "RESOLVING_ROUTE" }
  | { state: Page.HOME; home: Home }
  | { state: Page.EDITOR; editor: Editor }
  | { state: Page.DEVELOPMENT_AUTHENTICATION }
  | { state: Page.CLI_LOGIN }

export type TEvent =
  | { type: "HOME_ROUTED" }
  | { type: "EDITOR_ROUTED"; id: string }
  | { type: "DEVELOPMENT_AUTHENTICATION_ROUTED" }
  | { type: "CLI_LOGIN_ROUTED" }

export interface Navigator extends Feature, StateMachine<TContext, TEvent> {}

export class Navigator {
  static mixins = ["Feature", "StateMachine"]
  readonly developmentAuthentication!: TFeature<
    typeof DevelopmentAuthentication
  >

  readonly cliLogin!: TFeature<typeof CliLogin>

  readonly createHome!: TFeature<typeof Home>

  readonly createEditor!: TFeature<typeof Editor>

  router = new Navigo("/")

  context: TContext = { state: "RESOLVING_ROUTE" }

  constructor() {
    this.injectFeatures({
      createEditor: "Editor",
      createHome: "Home",
      cliLogin: "CliLogin",
      developmentAuthentication: "DevelopmentAuthentication",
    })

    this.makeObservable({
      context: "observable",
    })

    this.router.on({
      "/": {
        as: Page.HOME,
        uses: () => this.send({ type: "HOME_ROUTED" }),
      },
      "/editor/:id": {
        as: Page.EDITOR,
        uses: ({ data }: { data: { id: string } }) =>
          this.send({ type: "EDITOR_ROUTED", id: data.id }),
      },
      "/auth/dev": {
        as: Page.DEVELOPMENT_AUTHENTICATION,
        uses: () => this.send({ type: "DEVELOPMENT_AUTHENTICATION_ROUTED" }),
      },
      "/cli/login": {
        as: Page.CLI_LOGIN,
        uses: () => this.send({ type: "CLI_LOGIN_ROUTED" }),
      },
    })

    this.router.resolve()
  }

  protected onEvent(event: TEvent): TContext | void {
    switch (event.type) {
      case "HOME_ROUTED": {
        return { state: Page.HOME, home: this.createHome() }
      }
      case "EDITOR_ROUTED": {
        return { state: Page.EDITOR, editor: this.createEditor(event.id) }
      }
      case "DEVELOPMENT_AUTHENTICATION_ROUTED": {
        return { state: Page.DEVELOPMENT_AUTHENTICATION }
      }
      case "CLI_LOGIN_ROUTED": {
        return { state: Page.CLI_LOGIN }
      }
    }
  }

  route<T extends Route>(
    ...args: T extends { params: Object }
      ? [name: T["name"], params: T["params"]]
      : [name: T["name"]]
  ) {
    this.router.navigateByName(args[0], args[1])
  }
}
