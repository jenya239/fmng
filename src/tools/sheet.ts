export class Sheet {
  _node: HTMLStyleElement
  _sheet: CSSStyleSheet

  constructor() {
    const node = (this._node = document.createElement('style'))
    document.head.appendChild(this._node)
    this._sheet = node.sheet!
  }

  insert(rule: string): void {
    this._sheet.insertRule(rule, 0)
  }
}
