import { Element, useElement } from '../tools/element'
import { bindEntry, Entry, useEntry } from '../tools/entry'
import * as fs from 'fs'
import * as Path from 'path'
import { Field, watch } from '../base/field'
import { Component } from '../tools/component'
import { Images } from './images'

const d = console.log

const CURRENT_PATH_KEY = 'current_path'

type Mode = 'filesystem' | 'selection'

export class View extends Component {
  readonly leftPanel: Element
  readonly items: Element
  readonly area: Element
  readonly images: Images
  readonly currentDir: Field<string | null>
  readonly currentEntry: Field<Entry | null>
  readonly activeItem: Field<Element | null>
  readonly mode: Field<Mode>
  readonly selection: Entry[] = []
  readonly modeSelector: Element

  _goParent: Element

  private activateElement(element: HTMLElement | EventTarget | null | undefined) {
    if (!element) return
    const active = element as unknown as HTMLElement
    const aot = active.offsetTop
    const pst = active.parentElement?.scrollTop || 0
    const poh = active.parentElement?.offsetHeight || 0
    d(aot, pst, poh)
    if (aot < pst + 30) {
      active.parentElement?.scroll(0, aot - 40)
    } else if (aot > pst + poh - 30) {
      active.parentElement?.scroll(0, aot - poh + 40)
    }
    const entry = useEntry(element)
    const item = useElement(element)
    if (entry) this.currentEntry.value = entry
    if (item) this.activeItem.value = item
  }

  constructor(parent: Component) {
    super(parent, 'view')
    this.leftPanel = Element.create('div', this.container, 'leftPanel')
    this.modeSelector = Element.create('div', this.leftPanel, 'modeSelector')
    this.items = Element.create('div', this.leftPanel, 'items')
    this.area = Element.create('div', this.container, 'area')
    this.area._node.setAttribute('contenteditable', 'true')
    this._goParent = Element.create<HTMLElement>('div', undefined, 'item', '..')
    this.images = new Images(this)

    this.modeSelector._node.addEventListener('click', (event) => {
      this.mode.value = this.mode.value === 'filesystem' ? 'selection' : 'filesystem'
    })
    this.items._node.addEventListener('click', (event) => {
      this.activateElement(event.target)
    })
    this._goParent._node.addEventListener('click', () => {
      if (this.currentDir.value !== null)
        this.currentDir.value = Path.resolve(this.currentDir.value || '', '..')
    })
    document.addEventListener('keydown', (e) => {
      e.preventDefault()
      e.stopPropagation()
      const active = this.activeItem.value
      if (!active) return
      if (e.key === 'PageDown') {
        let prev: HTMLElement | undefined = active?._node
        for (let i = 0; i < 20; i++) {
          prev = prev?.nextElementSibling as unknown as HTMLElement | undefined
        }
        if (!prev) return
        d('prev')
        //todo check item classname
        this.activateElement(prev)
      } else if (e.key === 'PageUp') {
        let next: HTMLElement | undefined = active?._node
        for (let i = 0; i < 20; i++) {
          next = next?.previousElementSibling as unknown as HTMLElement | undefined
        }
        if (!next) return
        d('next')
        //todo check item classname
        this.activateElement(next)
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        const prev = active?._node.nextElementSibling
        if (!prev) return
        d('prev')
        //todo check item classname
        this.activateElement(prev)
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        const next = active?._node.previousElementSibling
        if (!next) return
        d('next')
        //todo check item classname
        this.activateElement(next)
      } else if (e.key === 's') {
        //и удаление?
        const entry = this.currentEntry.value
        if (entry && !this.selection.includes(entry)) {
          d('add to selection', entry)
          this.selection.push(entry)
        }
      }
    })

    this.mode = new Field<Mode>('filesystem', 'viewMode')
    this.currentEntry = new Field<Entry | null>(null, 'currentEntry')
    this.activeItem = new Field<Element | null>(null, 'activeItem')
    this.currentDir = new Field<string | null>(
      null,
      'currentDir',
      (currentEntry: Entry | null) =>
        currentEntry?.isDir ? currentEntry.path : this.currentDir.value,
      [this.currentEntry]
    )
    watch(
      (currentEntry: Entry | null) => {
        if (!currentEntry) return
        if (currentEntry.isImage) {
          this.area.hide()
          this.images.container.show()
          this.images.entryHandler(currentEntry)
        } else {
          this.images.container.hide()
          this.area.show()
          if (currentEntry.isDir) {
            this.area.setHTML('dir: ' + currentEntry.path)
          } else {
            this.area.setHTML(currentEntry.getContent())
            document.title = Path.resolve(currentEntry.path)
          }
        }
      },
      [this.currentEntry],
      'updateArea'
    )
    watch(
      (currentPath: string) => {
        if (!currentPath) return
        localStorage.setItem(CURRENT_PATH_KEY, currentPath)
        document.title = Path.resolve(currentPath)
        this.items.setHTML('')
        this.items.append(this._goParent)
        const is = fs.readdirSync(currentPath, { withFileTypes: true })
        for (const i of is) {
          const item = Element.create('div', this.items, 'item', i.name)
          bindEntry(item._node, new Entry(i, currentPath))
        }
      },
      [this.currentDir],
      'updateDirEntries'
    )
    watch(
      (active: Element | null, oldActive: Element | null) => {
        if (oldActive) {
          oldActive._node.classList.remove('active')
          // oldActive._node.classList.add('oldActive')
        }
        if (active) {
          // active._node.classList.remove('oldActive')
          active._node.classList.add('active')
        }
      },
      [this.activeItem],
      'highlightActive'
    )
    watch(
      (mode: Mode) => {
        d('mode', mode)
        if (mode === 'filesystem') {
          // this.items.show()
          // show last dir
          this.items.setHTML('')
          const currentDir = this.currentDir.value
          if (currentDir) {
            this.items.append(this._goParent)
            const is = fs.readdirSync(currentDir, { withFileTypes: true })
            for (const i of is) {
              const item = Element.create('div', this.items, 'item', i.name)
              bindEntry(item._node, new Entry(i, currentDir))
            }
          }
        } else {
          // this.items.hide()
          this.items.setHTML('<div></div>')
          for (const entry of this.selection) {
            const item = Element.create('div', this.items, 'item', entry._dirent.name)
            bindEntry(item._node, entry)
          }
        }
        this.modeSelector._node.innerHTML = this.mode.value
      },
      [this.mode],
      'mode'
    )
    this.modeSelector._node.innerHTML = this.mode.value

    this.currentDir.value = localStorage.getItem(CURRENT_PATH_KEY) || '.'
  }
}
