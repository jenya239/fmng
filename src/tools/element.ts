type Attributes = { [name: string]: string }

export class Element<NodeType extends HTMLElement = HTMLElement> {
  private static elementsMap = new WeakMap<HTMLElement | EventTarget, Element>()

  readonly _isElement = true
  _node: NodeType
  _parent?: Element
  _savedDisplay = 'block'

  constructor(node: NodeType, parent?: Element) {
    this._node = node
    this._parent = parent
    Element.elementsMap.set(this._node, this)
  }

  static getElement(node: HTMLElement | EventTarget) {
    return Element.elementsMap.get(node)
  }

  static create<NodeType extends HTMLElement = HTMLElement>(
    tagName: keyof HTMLElementTagNameMap,
    parent?: Element | NodeType,
    className?: string,
    html?: string,
    attrs?: Attributes
  ): Element<NodeType> {
    const node = document.createElement(tagName) as unknown as NodeType
    if (className) node.className = className
    if (attrs) for (const name in attrs) node.setAttribute(name, attrs[name])
    const parentIsElement = parent && Object.prototype.hasOwnProperty.call(parent, '_isElement')
    const el = new Element<NodeType>(node, parentIsElement ? (parent as Element) : undefined)
    if (parent) {
      if (!parentIsElement) {
        ;(parent as NodeType).append(node)
      } else {
        ;(parent as Element).append(el)
      }
    }
    if (html) node.innerHTML = html
    return el
  }

  append(child: Element): void {
    child._parent = this
    this._node.append(child._node)
  }

  setHTML(html: string): void {
    this._node.innerHTML = html
  }

  show(): void {
    this._node.style.display = this._savedDisplay
  }

  hide(): void {
    if (this._node.style.display != 'none') this._savedDisplay = this._node.style.display
    this._node.style.display = 'none'
  }
}

export const useElement = (node: HTMLElement | EventTarget | null): Element | undefined =>
  node ? Element.getElement(node) : undefined
