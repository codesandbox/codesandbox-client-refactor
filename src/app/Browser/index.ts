import { Feature } from "reactive-app"

export interface Browser extends Feature {}

export interface PopupMessage {
  type: string
  data?: any
}

export class Browser {
  static mixins = ["Feature"]

  openPopup<M extends PopupMessage>(url: string, name: string) {
    let rejector
    const popup = window.open(
      url,
      name,
      `scrollbars=no,toolbar=no,location=no,titlebar=no,directories=no,status=no,menubar=no, ${getPopupDimensions()}`
    )

    function close() {
      popup?.close()
      if (rejector) rejector()
    }

    function waitForMessage<T extends M["type"]>(
      type: T
    ): Promise<M & { type: T }>
    function waitForMessage<T extends M>(cb: (message: M) => T): Promise<T>
    function waitForMessage<T extends M>(
      type: T["type"] | ((message: M) => T)
    ): Promise<T> {
      return new Promise((resolve, reject) => {
        rejector = reject
        window.addEventListener("message", function onMessage(event) {
          if (
            (typeof type === "string" && event.data.type === type) ||
            (typeof type === "function" && type(event.data))
          ) {
            window.removeEventListener("message", onMessage)
            rejector = undefined
            resolve(event.data)
          }
        })
      })
    }

    return {
      close,
      waitForMessage,
    }
  }
  setCookie(cookie: string) {
    document.cookie = cookie
  }
}
