import { Component, OnInit } from "@angular/core"

@Component({
  selector: "app-simon",
  templateUrl: "./simon.component.html",
  styleUrls: ["./simon.component.scss"],
})
export class SimonComponent {
  constructor() {
    this.canClick = false
    this.sequnce = []
    this.sequensToGuess = []
    this.score = 0
  }
  canClick: boolean
  sequnce: HTMLObjectElement[]
  sequensToGuess: HTMLObjectElement[]
  score: number

  async start() {
    this.score = 0
    topLeft = document.querySelector(".top-left-panel")
    topRight = document.querySelector(".top-right-panel")
    bottomRight = document.querySelector(".bottom-right-panel")
    bottomLeft = document.querySelector(".bottom-left-panel")
    this.sequnce = [getRandomPanel()]
    this.sequensToGuess = [...this.sequnce]

    console.log(this.sequnce[0])
    await this.runSequens()
  }

  async runSequens() {
    this.canClick = false
    for (const panel of this.sequnce) {
      //console.log(getRandomPanel())
      await flash(panel)
    }
    this.canClick = true
  }

  panelClicked = async (panel: string) => {
    if (!this.canClick) return
    const exeptedPanel = this.sequensToGuess.shift()
    if (String(exeptedPanel?.className).includes(panel.substr(0, 10))) {
      if (this.sequensToGuess.length === 0) {
        this.sequnce.push(getRandomPanel())
        this.sequensToGuess = [...this.sequnce]
        this.score++
        await new Promise((f) => setTimeout(f, 1000))
        this.runSequens()
      }
    } else {
      this.score = 0
      console.log(String(this.sequensToGuess))
      alert("you guessed the wrong panel \n game over")
    }
  }
}

var topLeft: any
var topRight: any
var bottomRight: any
var bottomLeft: any
const getRandomPanel = () => {
  const panels = [topLeft, topRight, bottomLeft, bottomRight]
  return panels[randomIntFromInterval(0, 3)]
}

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const flash = (panel: any) => {
  return new Promise((resolve, reject) => {
    panel.className += " active"
    setTimeout(() => {
      panel.className = panel.className.replace(" active", "")
      setTimeout(() => {
        resolve(panel.className)
      }, 250)
    }, 800)
  })
}
