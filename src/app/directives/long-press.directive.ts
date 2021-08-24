import { Directive, Output, EventEmitter, HostListener } from "@angular/core"

@Directive({
  selector: "button",
})
export class LongPressDirective {
  timeout: any

  @Output()
  longclick = new EventEmitter()

  @HostListener("touchstart")
  @HostListener("mousedown")
  onMouseDown() {
    this.timeout = setTimeout(() => {
      this.longclick.emit()
    }, 350)
  }

  @HostListener("touchend")
  @HostListener("mouseup")
  @HostListener("mouseleave")
  endPress() {
    clearTimeout(this.timeout)
  }
}
