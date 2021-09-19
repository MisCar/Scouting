import { Firestore, doc } from "@angular/fire/firestore"
import { Component, OnInit, ViewChild } from "@angular/core"
import { getDoc } from "firebase/firestore"
import { __values } from "tslib"
import { MatTable } from "@angular/material/table"

export interface PeriodicElement {
  position: number
  name: string
  score: number
}

const ELEMENT_DATA: PeriodicElement[] = []

@Component({
  selector: "app-leaderbord",
  templateUrl: "./leaderbord.component.html",
  styleUrls: ["./leaderbord.component.scss"],
})
export class LeaderbordComponent implements OnInit {
  highScores = new Map()
  names: [string]
  constructor(private firestore: Firestore) {
    this.names = [""]
  }

  @ViewChild(MatTable) table!: MatTable<PeriodicElement>

  displayedColumns: string[] = ["position", "name", "score"]
  dataSource = [...ELEMENT_DATA]

  ngOnInit(): void {
    this.updateTable()
  }
  async getHighScoresArray(): Promise<Map<string, number>> {
    const document = await getDoc(doc(this.firestore, "high scores/simon"))
    const data = document.data()
    for (let name in data) {
      let score = String(data[name].score)
      this.highScores.set(name, score)
    }

    return new Map([...this.highScores].sort((a, b) => b[1] - a[1]))
  }

  async updateTable() {
    this.dataSource = [...ELEMENT_DATA]
    let names = Array.from((await this.getHighScoresArray()).keys())
    let scores = Array.from((await this.getHighScoresArray()).values())
    for (let i = 1; i < Math.min(names.length + 1, 11); i++) {
      let row: PeriodicElement = {
        position: i,
        name: names[i - 1],
        score: scores[i - 1],
      }
      this.dataSource.push(row)
    }

    this.table.renderRows()
  }
}
