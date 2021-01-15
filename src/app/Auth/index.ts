import {
  Feature,
  PickContext,
  PickEvent,
  StateMachine,
  TFeature,
} from "reactive-app"

import type { AuthApi, ICurrentUserDTO } from "../AuthApi"
import type { Browser } from "../Browser"
import type { Environment } from "../Environment"
import type { Storage } from "../Storage"

export type TContext =
  | { state: "AUTHENTICATING" }
  | { state: "AUTHENTICATED"; currentUser: ICurrentUserDTO }
  | { state: "UNAUTHENTICATED"; error?: string }

export type TEvent =
  | { type: "SIGN_IN_REQUESTED" }
  | { type: "SIGN_OUT_REQUESTED" }
  | { type: "SIGNED_IN"; currentUser: ICurrentUserDTO }
  | { type: "SIGNED_OUT"; error?: string }

export interface Auth extends Feature, StateMachine<TContext, TEvent> {}

export type AuthenticationPopupMessage =
  | {
      type: "signin"
      data?: {
        jwt: string
      }
    }
  | {
      type: "duplicate"
      data: {
        provider: "github" | "google"
      }
    }
  | {
      type: "signup"
      data: {
        id: string
      }
    }

export class Auth {
  static mixins = ["Feature", "StateMachine"]
  readonly storage!: TFeature<typeof Storage>

  readonly browser!: TFeature<typeof Browser>

  readonly environment!: TFeature<typeof Environment>

  readonly authApi!: TFeature<typeof AuthApi>

  context: TContext = { state: "UNAUTHENTICATED" }

  constructor() {
    this.makeObservable({
      context: "observable",
    })
    this.injectFeatures({
      authApi: "AuthApi",
      environment: "Environment",
      browser: "Browser",
      storage: "Storage",
    })
  }

  protected onEvent(event: TEvent): TContext | void {
    return this.transition(this.context, event, {
      UNAUTHENTICATED: {
        SIGN_IN_REQUESTED: () => {
          this.onSignInRequested()
          return { state: "AUTHENTICATING" }
        },
      },
      AUTHENTICATING: {
        SIGNED_IN: ({ currentUser }) => ({
          state: "AUTHENTICATED",
          currentUser,
        }),
        SIGNED_OUT: ({ error }) => ({
          state: "UNAUTHENTICATED",
          error,
        }),
      },
      AUTHENTICATED: {
        SIGN_OUT_REQUESTED: () => {
          this.onSignOutRequested()
        },
        SIGNED_OUT: ({ error }) => ({
          state: "UNAUTHENTICATED",
          error,
        }),
      },
    })
  }
  private async onSignInRequested() {
    try {
      const currentUser = await this.authApi.signIn()
      this.send({
        type: "SIGNED_IN",
        currentUser,
      })
    } catch (error) {
      this.send({
        type: "SIGNED_OUT",
        error: error.message,
      })
    }
  }

  private async onSignOutRequested() {
    const popup = this.browser.openPopup<AuthenticationPopupMessage>(
      this.environment.authenticationEndpoint,
      "sign in"
    )

    try {
      const message = await popup.waitForMessage((message) => {
        if (
          message.type === "signin" ||
          message.type === "duplicate" ||
          message.type === "signup"
        ) {
          return message
        }
      })

      switch (message.type) {
        case "signin": {
          if (!message.data?.jwt) {
            break
          }

          if (this.environment.useDevelopmentAuthentication) {
            this.storage.set("devJwt", message.data.jwt)
            this.browser.setCookie(this.create30DaysExpirationCookie())
          } else {
            this.authApi.revokeToken(message.data.jwt)
          }
          break
        }
        case "duplicate": {
          /*
          state.duplicateAccountStatus = {
            duplicate: true,
            provider: data.provider,
          }
          */
          break
        }
        case "signup": {
          // state.pendingUserId = data.id
          break
        }
      }

      popup.close()
    } catch (error) {}
  }

  private create30DaysExpirationCookie() {
    const DAY = 1000 * 60 * 60 * 24
    const expiryDate = new Date(Date.now() + DAY * 30)
    return `signedInDev=true; expires=${expiryDate.toUTCString()}; path=/`
  }

  signIn() {
    this.send({ type: "SIGN_IN_REQUESTED" })
  }

  signOut() {
    this.send({ type: "SIGN_OUT_REQUESTED" })
  }
}
