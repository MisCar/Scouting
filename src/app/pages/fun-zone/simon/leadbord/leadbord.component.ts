import { Firestore, doc } from "@angular/fire/firestore"
import { Component, OnInit } from "@angular/core"
import { getDoc } from "firebase/firestore"
import { __values } from "tslib"
import { MatTable } from "@angular/material/table"

export interface PeriodicElement {
  place: number
  email: string
  score: number
}

const ELEMENT_DATA: PeriodicElement[] = []

@Component({
  selector: "app-leadbord",
  templateUrl: "./leadbord.component.html",
  styleUrls: ["./leadbord.component.scss"],
})
export class LeadbordComponent implements OnInit {
  highScores = new Map()
  emails: [string]
  constructor(private firestore: Firestore) {
    this.emails = [""]
  }

  displayedColumns: string[] = ["position", "email", "score"]
  dataSource = [...ELEMENT_DATA]

  ngOnInit(): void {}
  async getHighScoresArray(): Promise<Map<string, number>> {
    const document = await getDoc(doc(this.firestore, "high scores/simon"))
    const data = document.data()
    for (let email in data) {
      let score = String(data[email].score)
      this.highScores.set(email, score)
    }

    return new Map([...this.highScores].sort((a, b) => b[1] - a[1]))
  }

  async getHighScores() {
    console.log(await this.getHighScoresArray())
    let keys = (await this.getHighScoresArray()).keys()
    let emails = (await this.getHighScoresArray()).values()
    for (let i = 0; i < 11; i++) {
      this.dataSource.push($(this.displayedColumns[0]))
    }
  }
}
