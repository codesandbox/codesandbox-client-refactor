import { Feature } from "reactive-app"

export interface Storage extends Feature {}

export class Storage {
  static mixins = ["Feature"]

  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}
