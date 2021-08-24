import { Component, Input, OnInit } from "@angular/core"
import { Widget } from "src/app/interfaces/schema"

@Component({
  selector: "app-counter",
  templateUrl: "./counter.component.html",
  styleUrls: ["./counter.component.scss"],
})
export class CounterComponent implements OnInit {
  @Input()
  widget?: Widget

  value: number

  constructor() {
    this.value = 0
  }

  reset() {
    this.value = 0
  }

  increment() {
    this.value++
  }

  decrement() {
    this.value--
  }

  ngOnInit(): void {}
}
