import { watcher } from './watcher'

type Listener<T> = (value: T, oldValue?: T) => void

export class Field<T> {
  _value: T
  readonly _name: string | undefined

  constructor(value: T, name?: string, callback?: (...values: any[]) => T, fields?: Field<any>[]) {
    this._value = value
    this._name = name
    if (fields && callback) this.watch(callback, fields, this._name + 'Callback')
  }

  addListener(listener: Listener<T>, name?: string): void {
    watcher.watch(listener, [this], this._name + ':' + name)
  }

  removeListener(listener: Listener<T>): void {
    const a = 1
  }

  get value() {
    return this._value
  }

  set value(value) {
    if (this._value === value) return
    const oldValue = this._value
    this._value = value
    watcher.check(this, value, oldValue)
  }

  watch(callback: (...values: any[]) => T | undefined, fields: Field<any>[], name?: string): void {
    const listener = () => {
      const values = fields.map((field) => field.value)
      const newValue = callback(...values)
      if (newValue !== undefined) this.value = newValue
    }
    watcher.watch(listener, fields, name)
  }
}

export const watch = (
  listener: (...values: any[]) => void,
  fields: Field<any>[],
  name?: string
): void => {
  watcher.watch(listener, fields, name)
}
