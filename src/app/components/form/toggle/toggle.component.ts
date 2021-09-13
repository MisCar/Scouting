import { Component, Input, OnInit } from "@angular/core"
import { MatSlideToggleChange } from "@angular/material/slide-toggle"
import { WidgetInfo } from "app/models/schema.model"
import Widget from "app/utilities/widget"

@Component({
  selector: "app-toggle",
  templateUrl: "./toggle.component.html",
  styleUrls: ["./toggle.component.scss"],
})
export class ToggleComponent extends Widget<boolean> implements OnInit {
  @Input()
  widget?: WidgetInfo

  @Input()
  prefix?: string

  constructor() {
    super()
    this.value = false
    this.initial = this.value
  }

  changed(event: MatSlideToggleChange) {
    this.value = event.checked
  }

  ngOnInit(): void {
    if (this.widget !== undefined && this.prefix !== undefined) {
      this.initialize(this.widget, this.prefix)
    }
  }
}
