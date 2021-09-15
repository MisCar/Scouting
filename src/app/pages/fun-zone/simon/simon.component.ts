import { MatSnackBar } from "@angular/material/snack-bar"
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core"

@Component({
  selector: "app-simon",
  templateUrl: "./simon.component.html",
  styleUrls: ["./simon.component.scss"],
})
export class SimonComponent {
  @ViewChild("topLeft") topLeft!: ElementRef<HTMLDivElement>
  @ViewChild("bottomLeft") bottomLeft!: ElementRef<HTMLDivElement>
  @ViewChild("bottomRight") bottomRight!: ElementRef<HTMLDivElement>
  @ViewChild("topRight") topRight!: ElementRef<HTMLDivElement>

  canClick: boolean
  sequence: ElementRef<HTMLDivElement>[]
  sequenceToGuess: ElementRef<HTMLDivElement>[]
  score: number
  timeBetweenFlashs: number

  constructor(private snack: MatSnackBar) {
    this.canClick = false
    this.sequence = []
    this.sequenceToGuess = []
    this.score = 0
    this.timeBetweenFlashs = 800
  }

  async start() {
    this.score = 0
    this.sequence = [this.getRandomPanel()]
    this.sequenceToGuess = [...this.sequence]

    await this.runSequence()
  }

  async runSequence() {
    this.canClick = false
    for (const panel of this.sequence) {
      await this.flash(panel)
    }
    this.canClick = true
  }

  async panelClicked(panel: string) {
    if (!this.canClick) return

    const expectedPanel = this.sequenceToGuess.shift()
    if (expectedPanel?.nativeElement.classList.contains(panel)) {
      if (this.sequenceToGuess.length === 0) {
        this.sequence.push(this.getRandomPanel())
        this.sequenceToGuess = [...this.sequence]
        this.score++
        this.canClick = false
        await new Promise((resolve) => setTimeout(resolve, 1000))
        this.runSequence()
      }
    } else {
      this.canClick = false
      this.score = 0
      this.snack.open("You Guessed the Wrong Panel! Game Over", "Dismiss")
    }
  }

  getRandomPanel() {
    const panels = [
      this.topLeft,
      this.topRight,
      this.bottomLeft,
      this.bottomRight,
    ]
    return panels[Math.floor(Math.random() * panels.length)]
  }

  async flash(panel: ElementRef<HTMLDivElement>) {
    if (this.timeBetweenFlashs > 200) {
      this.timeBetweenFlashs -= 30
    }

    panel.nativeElement.classList.add("active")
    await new Promise((resolve) => setTimeout(resolve, this.timeBetweenFlashs))
    panel.nativeElement.classList.remove("active")

    await new Promise((resolve) => setTimeout(resolve, 250))
  }
}
