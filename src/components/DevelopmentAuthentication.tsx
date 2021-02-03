import * as React from "react"

import { useAuth } from "../app/auth/provider"
import { useEnvironment } from "../app/Environment/provider"

export const DevelopmentAuthentication = () => {
  const [jwt, setJwt] = React.useState("")
  const auth = useAuth()
  const environment = useEnvironment()

  return (
    <div>
      <h3>Developer Sign In</h3>
      <div>
        Please enter the token you get from{" "}
        <a
          href={environment.authenticationCliEndpoint}
          target="popup"
          rel="noreferrer noopener"
          onClick={(e) => {
            e.preventDefault()
            auth.openCliLoginPopup()
            return false
          }}
        >
          here
        </a>
        . This token will sign you in with your account from codesandbox.io.
      </div>
      <div>
        <input
          style={{ width: 600, height: 26 }}
          placeholder="Auth Code"
          value={jwt}
          onChange={(e) => {
            setJwt(e.target.value)
          }}
        />
        <button onClick={() => auth.verifyJwtToken(jwt)}>Submit</button>
      </div>

      {auth.context.state === "UNAUTHENTICATED" && auth.context.error && (
        <div>Error: {auth.context.error}</div>
      )}
    </div>
  )
}
