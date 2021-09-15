import { MatSnackBar } from "@angular/material/snack-bar"
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core"

@Component({
  selector: "app-simon",
  templateUrl: "./simon.component.html",
  styleUrls: ["./simon.component.scss"],
})
export class SimonComponent {
  @ViewChild("topLeft") topLeft!: HTMLObjectElement
  @ViewChild("bottomLeft") bottomLeft!: HTMLObjectElement
  @ViewChild("bottomRight") bottomRight!: HTMLObjectElement
  @ViewChild("topRight") topRight!: HTMLObjectElement

  constructor(private snackBar: MatSnackBar) {
    this.canClick = false
    this.sequence = []
    this.sequenceToGuess = []
    this.score = 0
    this.timeBetweenFlashs = 800
  }
  canClick: boolean
  sequence: ElementRef["nativeElement"][]
  sequenceToGuess: ElementRef["nativeElement"][]
  score: number
  timeBetweenFlashs: number

  async start() {
    this.startPanels()
    this.score = 0
    this.sequence = [this.getRandomPanel()]
    this.sequenceToGuess = [...this.sequence]

    await this.runSequence()
  }

  startPanels() {}

  async runSequence() {
    this.canClick = false
    for (const panel of this.sequence) {
      await this.flash(panel.nativeElement)
    }
    this.canClick = true
  }

  panelClicked = async (panel: string) => {
    if (!this.canClick) return
    const expectedPanel = this.sequenceToGuess.shift()
    if (expectedPanel?.nativeElement.className.includes(panel.substr(0, 10))) {
      if (this.sequenceToGuess.length === 0) {
        this.sequence.push(this.getRandomPanel())
        this.sequenceToGuess = [...this.sequence]
        this.score++
        this.canClick = false
        await new Promise((f) => setTimeout(f, 1000))
        this.runSequence()
      }
    } else {
      this.canClick = false
      this.score = 0
      this.snackBar.open("You Guessed the Wrong Panel! \n Game Over", "Dismis")
    }
  }

  getRandomPanel = () => {
    const panels = [
      this.topLeft,
      this.topRight,
      this.bottomLeft,
      this.bottomRight,
    ]
    return panels[Math.floor(Math.random() * 4)]
  }
  async flash(panel: HTMLObjectElement) {
    return new Promise((resolve, reject) => {
      if (this.timeBetweenFlashs > 200) this.timeBetweenFlashs -= 30

      console.log(panel)
      panel.className += " active"
      setTimeout(() => {
        panel.className = panel.className.replace(" active", "")
        setTimeout(() => {
          resolve(panel.className)
        }, 250)
      }, this.timeBetweenFlashs)
    })
  }
}
