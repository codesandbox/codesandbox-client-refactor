import { Factory, Feature, TFeature } from "reactive-app"
import type { AuthApi } from "../AuthApi"

export interface DevelopmentAuthentication extends Feature, Factory {}

export class DevelopmentAuthentication {
  static mixins = ["Feature", "Factory"]
  readonly authApi!: TFeature<typeof AuthApi>

  constructor() {
    this.injectFeatures({
      authApi: "AuthApi",
    })
  }

  private async onVerifyJwt(jwt: string) {
    try {
    } catch {}
    fetch(`/api/v1/auth/verify/${jwt}`)
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        if (res.errors) {
          throw new Error(res.errors.detail[0])
        }

        if (
          window.opener &&
          window.opener.location.origin === window.location.origin
        ) {
          window.opener.postMessage(
            {
              type: "signin",
              data: {
                jwt: res.data.token,
              },
            },
            protocolAndHost()
          )
        }
      })
      .catch((e) => {
        setError(e.message)
      })
  }
  verifyJwtToken(jwt: string) {
    this.send({ type: "VERIFY_JWT_REQUESTED", jwt })
  }
  openCliLoginPopup() {
    window.open(cliLoginUrl, "popup", "width=600,height=600")
  }
}
