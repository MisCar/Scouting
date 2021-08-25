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
    this.value = 0
  }

  reset() {
    this.value = 0
  }

  increment() {
    if (this.value !== undefined) {
      this.value++
    }
  }

  decrement() {
    if (this.value !== undefined) {
      this.value--
    }
  }

  ngOnInit(): void {
    if (this.widget !== undefined && this.prefix !== undefined) {
      this.initialize(this.widget, this.prefix)
    }
  }
}
