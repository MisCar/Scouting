import { Component, Input, OnInit } from "@angular/core"

@Component({
  selector: "app-widget-row",
  templateUrl: "./widget-row.component.html",
  styleUrls: ["./widget-row.component.scss"],
})
export class WidgetRowComponent implements OnInit {
  @Input()
  label?: string

  constructor() {}

  ngOnInit(): void {}
}
