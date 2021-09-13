import { Component, Input, OnInit } from "@angular/core"
import { WidgetInfo } from "app/models/schema.model"
import Widget from "app/utilities/widget"

@Component({
  selector: "app-counter",
  templateUrl: "./counter.component.html",
  styleUrls: ["./counter.component.scss"],
})
export class CounterComponent extends Widget<number> implements OnInit {
  @Input()
  widget?: WidgetInfo

  @Input()
  prefix?: string

  constructor() {
    super()
  }

  reset() {
    this.value = this.widget?.min ?? 0
  }

  increment() {
    const max = this.widget?.max
    if (this.value !== undefined && (max === undefined || this.value < max)) {
      this.value++
    }
  }

  decrement() {
    const min = this.widget?.min
    if (this.value !== undefined && (min === undefined || this.value > min)) {
      this.value--
    }
  }

  ngOnInit(): void {
    if (this.widget !== undefined && this.prefix !== undefined) {
      this.initialize(this.widget, this.prefix)
      this.value = this.widget.min ?? 0
      this.initial = this.value
    }
  }
}
