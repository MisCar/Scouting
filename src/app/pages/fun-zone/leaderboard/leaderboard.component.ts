import { Firestore, doc, getDoc, onSnapshot } from "@angular/fire/firestore"
import { Component, OnInit, ViewChild } from "@angular/core"
import { MatTable } from "@angular/material/table"

export interface RowElement {
  position: number
  name: string
  score: number
}

const ELEMENT_DATA: RowElement[] = []

@Component({
  selector: "app-leaderboard",
  templateUrl: "./leaderboard.component.html",
  styleUrls: ["./leaderboard.component.scss"],
})
export class LeaderboardComponent implements OnInit {
  dataSource = [...ELEMENT_DATA]
  highScores = new Map()
  names: [string]
  displayedColumns: string[] = ["position", "name", "score"]
  constructor(private firestore: Firestore) {
    this.names = [""]
  }

  @ViewChild(MatTable) table!: MatTable<RowElement>

  ngOnInit(): void {}
  async getHighScoresArray(): Promise<Map<string, number>> {
    const document = await getDoc(doc(this.firestore, "games/simon"))
    const data = document.data()
    for (let name in data) {
      let score = String(data[name].score)
      this.highScores.set(name, score)
    }

    return new Map([...this.highScores].sort((a, b) => b[1] - a[1]))
  }

  updateHighScores = onSnapshot(doc(this.firestore, "games/simon"), () => {
    this.updateTable()
  })

  async updateTable() {
    this.dataSource = [...ELEMENT_DATA]
    let names = Array.from((await this.getHighScoresArray()).keys())
    let scores = Array.from((await this.getHighScoresArray()).values())
    for (let i = 1; i < Math.min(names.length + 1, 11); i++) {
      let row: RowElement = {
        position: i,
        name: names[i - 1],
        score: scores[i - 1],
      }
      this.dataSource.push(row)
    }

    this.table.renderRows()
  }
}
