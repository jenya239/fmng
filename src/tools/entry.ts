import * as fs from 'fs'
import * as Path from 'path'
import { isBinaryFileSync } from 'isbinaryfile'
import { encode } from 'html-entities'
import { IMAGES } from '../components/images'

const d = console.log

export class Entry {
  readonly _isEntry = true
  readonly _dirent: fs.Dirent
  _content: string | undefined
  readonly isDir: boolean
  readonly isFile: boolean
  _stats: fs.Stats | undefined
  readonly path: string
  readonly extension: string
  readonly isImage: boolean

  constructor(dirent: fs.Dirent, parent: string) {
    this._dirent = dirent
    const path = (this.path = Path.join(parent, dirent.name))
    this.isDir = this._dirent.isDirectory()
    this.isFile = this._dirent.isFile()
    // const baseName = Path.basename(dirent.name)
    this.extension = Path.extname(dirent.name)
    this.isImage = IMAGES.includes(this.extension.replaceAll('.', '').toLowerCase())
    // this.content = dirent.isFile() ? fs.re
    try {
      this._stats = fs.statSync(path)
    } catch (e) {
      console.error(e)
    }
  }

  getContent(): string {
    if (!this._content) {
      if (this._stats) {
        if (isBinaryFileSync(this.path)) {
          this._content = 'binary'
        } else {
          if (this._stats.size > 1000000) {
            this._content = 'too big'
          } else {
            this._content = encode(fs.readFileSync(this.path, { encoding: 'utf8' }))
          }
        }
      } else {
        this._content = 'no stat'
      }
    }
    return this._content
  }
}

const entriesMap = new WeakMap<HTMLElement | EventTarget, Entry>()
export const bindEntry = (
  node: HTMLElement | EventTarget,
  entry: Entry
): void => {
  entriesMap.set(node, entry)
}
export const useEntry = (node: HTMLElement | EventTarget | null): Entry | undefined =>
  node ? entriesMap.get(node) : undefined
