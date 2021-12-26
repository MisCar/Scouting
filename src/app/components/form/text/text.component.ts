import { Component, Input, OnInit } from "@angular/core"
import { WidgetInfo } from "app/models/schema.model"
import Widget from "app/utilities/widget"

@Component({
  selector: "app-text",
  templateUrl: "./text.component.html",
  styleUrls: ["./text.component.scss"],
})
export class TextComponent extends Widget<string> implements OnInit {
  @Input()
  widget?: WidgetInfo

  @Input()
  prefix?: string

  @Input()
  numOfRows?: number

  constructor() {
    super()
    this.value = ""
    this.initial = this.value
  }

  changed(event: Event): void {
    this.value = (event.target as HTMLInputElement).value
  }

  ngOnInit(): void {
    if (this.widget !== undefined && this.prefix !== undefined) {
      this.initialize(this.widget, this.prefix)
    }
  }

  isRTL(x: string): boolean {
    return /[\u0590-\u05FF]/.test(x)
  }
}
