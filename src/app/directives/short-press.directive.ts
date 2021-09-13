import { Directive, EventEmitter, HostListener, Output } from "@angular/core"

@Directive({
  selector: "button",
})
export class ShortPressDirective {
  started?: number

  @Output()
  shortclick = new EventEmitter()

  @HostListener("touchstart")
  @HostListener("mousedown")
  onMouseDown() {
    this.started = Date.now()
  }

  @HostListener("touchend")
  @HostListener("mouseup")
  @HostListener("mouseleave")
  endPress() {
    if (this.started === undefined) {
      return
    }

    if (Date.now() - this.started < 350) {
      this.shortclick.emit()
    }
  }
}
