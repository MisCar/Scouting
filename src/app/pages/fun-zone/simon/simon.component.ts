import { MatSnackBar } from "@angular/material/snack-bar"
import { Component, ElementRef, ViewChild } from "@angular/core"
import { Firestore, doc, setDoc, getDoc } from "@angular/fire/firestore"
import { AuthenticationService } from "app/services/authentication.service"

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
  highScore: number
  timeBetweenFlashs: number
  lastPanelGuessed?: ElementRef<HTMLDivElement>

  constructor(
    private snack: MatSnackBar,
    private firestore: Firestore,
    private authentication: AuthenticationService
  ) {
    this.canClick = false
    this.sequence = []
    this.sequenceToGuess = []
    this.score = 0
    this.timeBetweenFlashs = 800
    this.highScore = 0
  }

  async start() {
    this.timeBetweenFlashs = 800
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
      this.playSound(panel)

      if (this.sequenceToGuess.length === 0) {
        this.sequence.push(this.getRandomPanel())
        this.sequenceToGuess = [...this.sequence]
        this.score++
        if (this.score > this.highScore) {
          this.highScore = this.score
        }
        this.canClick = false
        await new Promise((resolve) => setTimeout(resolve, 1000))
        this.runSequence()
      }
    } else {
      this.playSound("wrong")
      this.canClick = false
      this.updateHighScore(
        this.highScore,
        this.authentication.user?.displayName
      )
      this.score = 0
      this.snack.open("You Guessed the Wrong Panel! Game Over", "Dismiss", {
        duration: 3000,
      })
    }
  }

  getRandomPanel() {
    const panels = [
      this.topLeft,
      this.topRight,
      this.bottomLeft,
      this.bottomRight,
    ]
    let panel = panels[Math.floor(Math.random() * panels.length)]
    if (panel === this.lastPanelGuessed) {
      panel = panels[Math.floor(Math.random() * panels.length)]
    }
    this.lastPanelGuessed = panel
    return panel
  }

  async flash(panel: ElementRef<HTMLDivElement>) {
    if (this.timeBetweenFlashs > 130) {
      this.timeBetweenFlashs -= 30
    }

    this.playSound(panel.nativeElement.classList[0])

    panel.nativeElement.classList.add("active")
    await new Promise((resolve) => setTimeout(resolve, this.timeBetweenFlashs))
    panel.nativeElement.classList.remove("active")

    await new Promise((resolve) => setTimeout(resolve, 250))
  }

  async updateHighScore(highScore: number, name?: string | null) {
    if (name === undefined || name === null) name = ""
    if (highScore > (await this.getCurrentHighScore(name))) {
      setDoc(
        doc(this.firestore, "games/simon"),
        { [name]: { score: highScore } },
        { merge: true }
      )
    }
  }

  async getCurrentHighScore(targetName: string): Promise<number> {
    let highScore = 0
    const document = await getDoc(doc(this.firestore, "games/simon"))
    const data = document.data()
    for (let name in data) {
      if (name === targetName) {
        let score = data[name].score
        highScore = score
      }
    }
    return highScore
  }

  playSound(color: string) {
    let audio = new Audio()
    if (color == "top-right-panel") {
      audio.src = "assets/sounds/simonSound1.mp3"
    }
    if (color == "top-left-panel") {
      audio.src = "assets/sounds/simonSound2.mp3"
    }
    if (color == "bottom-right-panel") {
      audio.src = "assets/sounds/simonSound3.mp3"
    }
    if (color == "bottom-left-panel") {
      audio.src = "assets/sounds/simonSound4.mp3"
    }
    if (color == "wrong") {
      audio.src = "assets/sounds/error.mp3"
    }
    audio.load()
    audio.play()
  }
}
