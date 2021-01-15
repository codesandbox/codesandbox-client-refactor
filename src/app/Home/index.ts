import { Factory, Feature, View } from "reactive-app"

export interface Home extends Feature, Factory, View {}

export class Home {
  static mixins = ["Feature", "Factory", "View"]

  constructor() {
    this.render(document.body)
  }

  render(parent: HTMLElement) {
    const $ = this.html`<h1>Hello World</h1>`
    $.appendTo(parent)
  }
}
