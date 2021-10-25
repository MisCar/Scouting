import { ThrowStmt } from "@angular/compiler"
import { Component, OnInit } from "@angular/core"
import { collection, Firestore, getDocs } from "@angular/fire/firestore"
import {
  Events,
  TheBlueAllianceService,
} from "app/services/the-blue-alliance.service"

interface TableRow {
  missing: string
  incorrect: string
}

@Component({
  selector: "app-scout-overview",
  templateUrl: "./scout-overview.component.html",
  styleUrls: ["./scout-overview.component.scss"],
})
export class ScoutOverviewComponent implements OnInit {
  events: Events = []
  stage: string = ""
  event: string = ""
  teams: string[] = []
  missingTeams: string[] = []
  incorrectTeams: string[] = []
  showMissingTeams: boolean = true
  displayedColumns: string[] = ["missingScouts", "incorrectScouts"]
  daraSource: TableRow[] = []
  showTable = false

  constructor(
    private tba: TheBlueAllianceService,
    private firestore: Firestore
  ) {
    this.tba.getEvents().then((events) => {
      this.events = events.filter(
        (event) => new Date(event.end_date).getFullYear() > 2019
      )
    })
  }

  ngOnInit(): void {}

  async getTeams(game: number): Promise<string[]> {
    try {
      await this.tba.getTeams(this.event, this.stage, game).then((val) => {
        this.teams = val
      })
      return this.teams
    } catch {
      return [""]
    }
  }

  async getScoutsNames(): Promise<string[]> {
    const document = await getDocs(collection(this.firestore, this.event))
    const data = document.docs
    let names: any[] = []
    for (let name of data) {
      if (this.stage == "f") {
        if (name.id.split("")[0] == this.stage) names.push(name.id)
      } else {
        if (name.id.includes(this.stage)) names.push(name.id)
      }
    }
    return names
  }

  async findMissingScouts() {
    this.missingTeams = []
    this.incorrectTeams = []
    const scouts = await this.getScoutsNames()
    let splitedScouts = []
    for (let scout of scouts) {
      splitedScouts.push(scout.split(" "))
    }
    let gameNumbers = []
    for (let number of splitedScouts) {
      console.log(number)
      gameNumbers.push(Number(number[1]))
    }

    for (let i = 1; i < this.findMaxGameNum(gameNumbers) + 1; i++) {
      let specificTeams = []
      for (let scout of splitedScouts) {
        if (Number(scout[1]) === i) {
          specificTeams.push(scout[2])
        }
      }

      const needTeams: string[] = await this.getTeams(i)

      for (let team of needTeams) {
        if (!specificTeams.includes(team)) {
          if (team === "") continue
          this.missingTeams.push(
            this.convertStage(this.stage) + " " + i + ": Team #" + team
          )
        }
      }

      for (let team of specificTeams) {
        if (!needTeams.includes(team)) {
          this.incorrectTeams.push(
            this.convertStage(this.stage) + " " + i + ": Team #" + team
          )
        }
      }
    }
    this.showMissingTeams = true

    this.updateDataSource()
  }

  findMaxGameNum(gameNumbers: number[]): number {
    return Math.max(...gameNumbers)
  }

  updateDataSource() {
    this.showTable = false
    this.daraSource = []
    for (
      let i = 0;
      i < Math.max(this.incorrectTeams.length, this.missingTeams.length);
      i++
    ) {
      let missing = ""
      let incorrect = ""
      if (this.missingTeams[i] !== undefined) {
        missing = this.missingTeams[i]
      }

      if (this.incorrectTeams[i] !== undefined) {
        incorrect = this.incorrectTeams[i]
      }
      this.daraSource.push({ missing: missing, incorrect: incorrect })

      console.log(this.daraSource[i])
    }
    console.log(this.daraSource.length)
    this.showTable = true
  }

  convertStage(stage: string): string {
    if (stage == "pr") {
      return "Practice"
    }
    if (stage == "qm") {
      return "Qualifications"
    }
    if (stage == "qf") {
      return "Quaterfinals"
    }
    if (stage == "sf") {
      return "Semfinals"
    }
    if (stage == "f") {
      return "Finals"
    }
    return ""
  }
}
