import { Container, mock } from "reactive-app"

import { AuthApi } from "../AuthApi"
import { Auth } from "./"

describe("Auth", () => {
  test("Should pass", async () => {
    const MockedAuthApi = mock(AuthApi, {
      signIn() {
        return Promise.resolve({
          jwt: "123",
        })
      },
    })

    const container = new Container({
      Auth,
      AuthApi: MockedAuthApi,
    })

    const auth = container.get("Auth")

    auth.signIn()

    await Promise.resolve()

    expect(auth.context.state === "AUTHENTICATED")
  })
})
