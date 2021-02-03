import { Feature } from "reactive-app"

export interface Browser extends Feature {}

export type WindowMessage = {
  type: string
  data?: any
}

function getPopupOffset({ width, height }: { width: number; height: number }) {
  const wLeft = window.screenLeft ? window.screenLeft : window.screenX
  const wTop = window.screenTop ? window.screenTop : window.screenY

  const left = wLeft + window.innerWidth / 2 - width / 2
  const top = wTop + window.innerHeight / 2 - height / 2

  return { top, left }
}

function getPopupSize() {
  return { width: 1020, height: 618 }
}

function getPopupDimensions() {
  const { width, height } = getPopupSize()
  const { top, left } = getPopupOffset({ width, height })

  return `width=${width},height=${height},top=${top},left=${left}`
}

export class Browser {
  static mixins = ["Feature"]

  openPopup(url: string, name: string) {
    let closeResolver: Function
    const popup = window.open(
      url,
      name,
      `scrollbars=no,toolbar=no,location=no,titlebar=no,directories=no,status=no,menubar=no, ${getPopupDimensions()}`
    )

    if (popup) {
      const timer = setInterval(function () {
        if (popup.closed) {
          clearInterval(timer)
          closeResolver()
        }
      }, 500)
    }

    const close = () => {
      popup?.close()
    }

    const closePromise = new Promise<void>((resolve) => {
      closeResolver = resolve
    })

    return {
      close,
      closePromise,
    }
  }
  waitForMessage<T extends WindowMessage>(
    type: T["type"]
  ): Promise<WindowMessage>
  waitForMessage<T extends WindowMessage>(
    cb: (message: T) => T | void
  ): Promise<T>
  waitForMessage(type: string | ((data: WindowMessage) => WindowMessage)) {
    return new Promise((resolve) => {
      window.addEventListener("message", function onMessage(event) {
        if (
          (typeof type === "string" && event.data.type === type) ||
          (typeof type === "function" && type(event.data))
        ) {
          window.removeEventListener("message", onMessage)
          resolve(event.data)
        }
      })
    })
  }
  setCookie(cookie: string) {
    document.cookie = cookie
  }
}
