import { Component, Input, OnInit } from "@angular/core"
import { WidgetInfo } from "app/models/schema.model"
import Widget from "app/utilities/widget"

@Component({
  selector: "app-timer",
  templateUrl: "./timer.component.html",
  styleUrls: ["./timer.component.scss"],
})
export class TimerComponent extends Widget<number> implements OnInit {
  @Input()
  widget?: WidgetInfo

  @Input()
  prefix?: string

  started?: number
  interval?: number
  offset = 0

  get text() {
    const value = this.value

    if (value === undefined) {
      return "00.00"
    }

    return `${Math.floor(value / 10)}${Math.floor(value % 10)}.${Math.floor(
      (value * 10) % 10
    )}${Math.floor((value * 100) % 10)}`
  }

  constructor() {
    super()
    this.value = 0
  }

  updateTimer() {
    if (this.started === undefined) {
      return
    }

    this.value = (Date.now() - this.started) / 1000 + this.offset
  }

  click() {
    if (this.started === undefined) {
      if (this.value === undefined) {
        this.value = 0
      }
      this.offset = this.value

      this.started = Date.now()
      this.interval = window.setInterval(() => this.updateTimer(), 50)
    } else {
      this.offset += (Date.now() - this.started) / 1000
      window.clearInterval(this.interval)
      this.started = undefined
      this.interval = undefined
    }
  }

  reset() {
    this.value = 0
    this.offset = 0
  }

  ngOnInit(): void {
    if (this.widget !== undefined && this.prefix !== undefined) {
      this.initialize(this.widget, this.prefix)
    }
  }
}
