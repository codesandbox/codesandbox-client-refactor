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

export type AuthenticationProvider = "google" | "github"

export type AuthenticationPopupMessage =
  | {
      type: "signin"
      data: {
        jwt?: string
      }
    }
  | {
      type: "duplicate"
      data: {
        provider: AuthenticationProvider
      }
    }
  | {
      type: "signup"
      data: {
        id: string
      }
    }

export type TContext =
  | { state: "AUTHENTICATING" }
  | { state: "AUTHENTICATED"; currentUser: ICurrentUserDTO }
  | { state: "DUPLICATE"; provider: AuthenticationProvider }
  | { state: "SIGNING_UP"; id: string }
  | { state: "SIGNING_IN" }
  | { state: "UNAUTHENTICATED"; error?: string }
  | { state: "UNAUTHENTICATING" }

export type TEvent =
  | { type: "SIGN_IN_REQUESTED" }
  | { type: "SIGN_OUT_REQUESTED" }
  | {
      type: "DUPLICATE_ACCOUNT_MESSAGE_RECEIVED"
      provider: AuthenticationProvider
    }
  | { type: "SIGN_UP_MESSAGE_RECEIVED"; id: string }
  | { type: "SIGN_IN_MESSAGE_RECEIVED"; jwt?: string }
  | { type: "FETCH_CURRENT_USER_RESOLVED"; currentUser: ICurrentUserDTO }
  | { type: "FETCH_CURRENT_USER_REJECTED"; error: string }
  | { type: "SIGN_IN_ABORT" }
  | { type: "SIGNED_OUT"; error?: string }
  | { type: "SIGN_OUT_RESOLVED" }
  | { type: "SIGN_OUT_REJECTED"; error: string }

export interface Auth extends Feature, StateMachine<TContext, TEvent> {}

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
        SIGN_IN_ABORT: () => ({
          state: "UNAUTHENTICATED",
        }),
        DUPLICATE_ACCOUNT_MESSAGE_RECEIVED: ({ provider }) => ({
          state: "DUPLICATE",
          provider,
        }),
        SIGN_UP_MESSAGE_RECEIVED: ({ id }) => ({
          state: "SIGNING_UP",
          id,
        }),
        SIGN_IN_MESSAGE_RECEIVED: ({ jwt }) => {
          if (!jwt) {
            return { state: "UNAUTHENTICATED", error: "Missing JWT token" }
          }

          this.setToken(jwt)
          this.getCurrentUser()

          return { state: "SIGNING_IN" }
        },
      },
      SIGNING_IN: {
        FETCH_CURRENT_USER_RESOLVED: ({ currentUser }) => ({
          state: "AUTHENTICATED",
          currentUser,
        }),
        FETCH_CURRENT_USER_REJECTED: ({ error }) => ({
          state: "UNAUTHENTICATED",
          error,
        }),
      },
      AUTHENTICATED: {
        SIGN_OUT_REQUESTED: () => {
          this.onSignOutRequested()
          return { state: "UNAUTHENTICATING" }
        },
      },
      UNAUTHENTICATING: {
        SIGNED_OUT: ({ error }) => ({
          state: "UNAUTHENTICATED",
          error,
        }),
        SIGN_OUT_REJECTED: ({ error }) => ({
          state: "UNAUTHENTICATED",
          error,
        }),
        SIGN_OUT_RESOLVED: () => ({
          state: "UNAUTHENTICATED",
        }),
      },
      DUPLICATE: {},
      SIGNING_UP: {},
    })
  }
  private setToken(jwt: string) {
    if (this.environment.useDevelopmentAuthentication) {
      this.storage.set("devJwt", jwt)
      this.browser.setCookie(this.create30DaysExpirationCookie())
    } else {
      this.authApi.revokeToken(jwt)
    }
  }
  private async getCurrentUser() {
    try {
      const currentUser = await this.authApi.signIn()
      this.send({
        type: "FETCH_CURRENT_USER_RESOLVED",
        currentUser,
      })
    } catch (error) {
      this.send({
        type: "FETCH_CURRENT_USER_REJECTED",
        error: error.message,
      })
    }
  }
  private async onSignInRequested() {
    const popup = this.browser.openPopup(
      this.environment.authenticationEndpoint,
      "sign in"
    )

    try {
      const possibleMessage = await Promise.race([
        popup.closePromise,
        this.browser.waitForMessage<AuthenticationPopupMessage>((message) => {
          if (
            message.type === "signin" ||
            message.type === "duplicate" ||
            message.type === "signup"
          ) {
            return message
          }
        }),
      ])

      if (!possibleMessage) {
        this.send({ type: "SIGN_IN_ABORT" })
        return
      }

      const message = possibleMessage
      switch (message.type) {
        case "signin": {
          this.send({
            type: "SIGN_IN_MESSAGE_RECEIVED",
            jwt: message.data.jwt,
          })
          break
        }
        case "duplicate": {
          this.send({
            type: "DUPLICATE_ACCOUNT_MESSAGE_RECEIVED",
            provider: message.data.provider,
          })
          break
        }
        case "signup": {
          this.send({
            type: "SIGN_UP_MESSAGE_RECEIVED",
            id: message.data.id,
          })
          break
        }
      }
      popup.close()
    } catch (error) {
      this.send({
        type: "SIGNED_OUT",
        error: error.message,
      })
    }
  }

  private async onSignOutRequested() {
    try {
      await this.authApi.signout()
      this.send({
        type: "SIGN_OUT_RESOLVED",
      })
    } catch (error) {
      this.send({
        type: "SIGN_OUT_REJECTED",
        error: error.message,
      })
    }
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
