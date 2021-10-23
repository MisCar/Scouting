import { WidgetInfo } from "app/models/schema.model"

export const storagePrefix = "[Form] "

export default abstract class Widget<T> {
  private key?: string
  private _initial?: T
  private _value?: T

  public get value(): T | undefined {
    return this._value
  }

  protected set value(value: T | undefined) {
    this._value = value
    if (this.key !== undefined) {
      localStorage.setItem(this.key, JSON.stringify(value))
    }
  }

  public get initial(): T | undefined {
    return this._initial
  }

  public set initial(value: T | undefined) {
    this._initial = value
  }

  private update(value: string | null) {
    if (value !== null) {
      this.value = JSON.parse(value)
    }
  }

  protected initialize(info: WidgetInfo, prefix: string) {
    this.key = storagePrefix + prefix + " " + info.key
    const current = localStorage.getItem(this.key)
    if (current !== null) {
      this.update(current)
    } else {
      localStorage.setItem(this.key, JSON.stringify(this.value))
    }

    window.addEventListener("storage", ({ key, newValue }) => {
      if (this.key !== undefined && key === this.key) {
        this.update(newValue)
      }
    })

    window.addEventListener("formclear", () => {
      this.value = this.initial
    })
  }
}
