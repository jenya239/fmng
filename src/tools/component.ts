import { Element } from './element'

export class Component {
  readonly _isComponent = true
  readonly _parent: Component
  readonly container: Element

  constructor(parent: Component, containerClass: string) {
    this._parent = parent
    this.container = Element.create('div', this._parent.container, containerClass)
  }
}
