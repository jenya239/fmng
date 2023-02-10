import { Element } from '../tools/element'
import { Component } from '../tools/component'
import { Entry } from '../tools/entry'

export const IMAGES = 'png jpg jpeg gif bmp svg'.split(' ')

export class Images extends Component {
  readonly image: Element
  constructor(parent: Component) {
    super(parent, 'images')
    // this.container.setHTML('images')
    this.container.hide()
    this.image = Element.create('div', this.container, 'imageViewer', undefined, {})
  }
  entryHandler(entry: Entry) {
    if (!entry.isImage) {
      console.log('this is not image')
      return
    }
    this.image._node.style.backgroundImage = `url(file://${entry.path})`
  }
}
