import { Field } from './field'

export const d = console.log

class Change<T> {
  readonly _field: Field<T>
  readonly _value: T
  readonly _oldValue?: T

  constructor(field: Field<T>, value: T, oldValue?: T) {
    this._field = field
    this._value = value
    this._oldValue = oldValue
    //d('change', field._name, value, '<-', oldValue)
  }
}

type Listener = (...values: any[]) => void

class Watch {
  static id = 0
  readonly _id = Watch.id++
  readonly _listener: Listener
  readonly _fields: readonly Field<any>[]
  readonly _name: string | undefined
  constructor(listener: Listener, fields: Field<any>[], name?: string) {
    this._listener = listener
    this._fields = fields
    this._name = name
    console.log(`watch ${this._id} ${this._name}`)
  }
}

class Watcher {
  readonly _changes: Change<any>[] = []
  readonly _watches: Watch[] = []
  _timeoutId = -1

  check<T>(field: Field<T>, value: T, oldValue?: T): void {
    this._changes.push(new Change<T>(field, value, oldValue))
    if (this._timeoutId < 0) {
      this._timeoutId = window.setTimeout(this._handler.bind(this), 0)
    }
  }
  watch(listener: Listener, fields: Field<any>[], name?: string): void {
    this._watches.push(new Watch(listener, fields, name))
  }
  _handler(): void {
    d('')
    const changes = this._changes.slice()
    this._changes.length = 0
    const fieldsChanges = new WeakMap<Field<unknown>, Change<unknown>[]>()
    const changed: Field<unknown>[] = []
    for (const change of changes) {
      if (!fieldsChanges.has(change._field)) fieldsChanges.set(change._field, [])
      fieldsChanges.get(change._field)?.push(change)
      if (!changed.includes(change._field)) changed.push(change._field)
    }
    const finalChanges = new WeakMap<Field<unknown>, Change<unknown>>()
    for (const field of changed) {
      const fieldChanges = fieldsChanges.get(field)
      if (!fieldChanges) continue
      const finalChange =
        fieldChanges.length === 1
          ? fieldChanges[0]
          : new Change(
              field,
              fieldChanges[fieldChanges.length - 1]._value,
              fieldChanges[0]._oldValue //а вот здесь oldValue - это точно то первоначальное значение поля, которое было?
            )
      finalChanges.set(field, finalChange)
    }
    //собираем watches, которые затронули эти changed
    const watches: Watch[] = []
    for (const field of changed) {
      const change = finalChanges.get(field)
      if (!change) continue
      // d('process', field._name, change._oldValue, change._value)
      for (const watch of this._watches) {
        if (watch._fields.includes(field) && !watches.includes(watch)) {
          watches.push(watch)
        }
      }
    }
    for (const watch of watches) {
      const names = watch._fields.map((f) => f._name)
      const values = watch._fields.map((f) => f.value)
      const oldValues = watch._fields.map((f) => finalChanges.get(f)?._oldValue)
      d('> ' + watch._name, ...names, ...values, '<-', ...oldValues)
      watch._listener(...values, ...oldValues)
    }
    //если образовались новые, то опять
    if (this._changes.length === 0) {
      this._timeoutId = -1
    } else {
      this._timeoutId = window.setTimeout(this._handler.bind(this), 0)
    }
  }
}

export const watcher = new Watcher()
