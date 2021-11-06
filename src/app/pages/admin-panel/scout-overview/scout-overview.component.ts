import { ThrowStmt } from "@angular/compiler"
import { Component, OnInit } from "@angular/core"
import { collection, Firestore, getDocs } from "@angular/fire/firestore"
import { BackendService } from "app/services/backend.service"
import {
  TBAEvents,
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
  events: TBAEvents = []
  stage: string = ""
  teams: number[][] = []
  missingTeams: string[] = []
  incorrectTeams: string[] = []
  showMissingTeams: boolean = true
  displayedColumns: string[] = ["missingScouts", "incorrectScouts"]
  daraSource: TableRow[] = []
  showTable = false

  constructor(
    private tba: TheBlueAllianceService,
    private firestore: Firestore,
    private backend: BackendService
  ) {}

  ngOnInit(): void {}

  async getTeams(game: number): Promise<number[][]> {
    this.teams = await this.tba.getTeams(this.backend.event, this.stage, game)
    return this.teams
  }

  async getScoutsNames(): Promise<string[]> {
    const document = await getDocs(
      collection(this.firestore, this.backend.event)
    )
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
      gameNumbers.push(Number(number[1]))
    }

    const lastGame = this.findMaxGameNum(gameNumbers)
    for (let i = 1; i < lastGame + 1; i++) {
      let specificTeams: number[] = []
      for (let scout of splitedScouts) {
        if (Number(scout[1]) === i) {
          specificTeams.push(Number(scout[2]))
        }
      }

      const [redTeams, blueTeams] = await this.getTeams(i)
      const needTeams = [...redTeams, ...blueTeams]

      for (let team of needTeams) {
        if (!specificTeams.includes(team)) {
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
    }
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
      return "Quarterfinals"
    }
    if (stage == "sf") {
      return "Semifinals"
    }
    if (stage == "f") {
      return "Finals"
    }
    return ""
  }
}
