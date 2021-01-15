import * as querystring from "query-string"
import { Feature, TFeature } from "reactive-app"

import type { Auth } from "../Auth"
import type { Environment } from "../Environment"

export interface RestApi extends Feature {}

type TRequestQuery = {
  [key: string]: string
}

type TRequest = {
  path: string
  query?: TRequestQuery
} & (
  | {
      method: "GET"
    }
  | {
      method: "POST"
      data: object
    }
  | {
      method: "PATCH"
      data: object
    }
  | {
      method: "DELETE"
    }
)

export class RestApi {
  static mixins = ["Feature"]
  readonly auth!: TFeature<typeof Auth>

  readonly environment!: TFeature<typeof Environment>

  constructor() {
    this.injectFeatures({
      environment: "Environment",
      auth: "Auth",
    })
  }

  private fetch<T>(request: TRequest): Promise<T> {
    const method = request.method
    const url = `${this.environment.apiEndpoint}${request.path}${
      request.query ? `?${querystring.stringify(request.query)}` : ""
    }`
    const body =
      request.method === "POST" ? JSON.stringify(request.data) : undefined
    const headers =
      this.auth.context.state === "AUTHENTICATED"
        ? {
            Authorization: `Bearer ${this.auth.context.currentUser.jwt}`,
          }
        : {}

    return fetch(url, {
      method,
      body,
      headers,
    }).then((response) => response.json())
  }

  get<T>(path: string, query?: TRequestQuery) {
    return this.fetch<T>({
      method: "GET",
      path,
      query,
    })
  }

  post<T>(path: string, data: object, query?: TRequestQuery) {
    return this.fetch<T>({
      method: "POST",
      path,
      data,
      query,
    })
  }

  patch<T>(path: string, data: object, query?: TRequestQuery) {
    return this.fetch<T>({
      method: "PATCH",
      path,
      data,
      query,
    })
  }
  delete<T>(path: string, query?: TRequestQuery) {
    return this.fetch<T>({
      method: "DELETE",
      path,
      query,
    })
  }
}
