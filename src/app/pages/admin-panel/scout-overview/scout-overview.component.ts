import { Component, OnInit } from "@angular/core"
import { collection, Firestore, getDocs } from "@angular/fire/firestore"
import { MatSnackBar } from "@angular/material/snack-bar"
import { display, stage } from "app/models/stage.model"
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
  stage?: stage
  missingTeams: string[] = []
  incorrectTeams: string[] = []
  showMissingTeams: boolean = true
  displayedColumns: string[] = ["missingScouts", "incorrectScouts"]
  daraSource: TableRow[] = []
  showTable = false
  allTeamsWithScouts: string[] = []
  team: string = ""

  constructor(
    private tba: TheBlueAllianceService,
    private firestore: Firestore,
    private backend: BackendService,
    private snack: MatSnackBar
  ) {
    this.updateAllTeams()
  }

  ngOnInit(): void {}

  getTeams(game: number) {
    if (this.stage === undefined) {
      return []
    }
    return this.tba.getTeams(this.backend.event, this.stage, game)
  }

  async getScoutsNames(): Promise<string[]> {
    if (this.stage === undefined) {
      return []
    }

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
    if (this.stage === undefined) {
      return
    }

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
            display(this.stage) + " " + i + ": Team #" + team
          )
        }
      }

      for (let team of specificTeams) {
        if (!needTeams.includes(team)) {
          this.incorrectTeams.push(
            display(this.stage) + " " + i + ": Team #" + team
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

  fetchAllScouts() {
    getDocs(collection(this.firestore, this.backend.event))
      .then((result) => {
        const scouts = result.docs.map((doc) => {
          const [level, match, team] = doc.id.split(" ")
          return {
            level,
            match: Number(match),
            team: Number(team),
            ...doc.data(),
          }
        })
        window.localStorage.setItem("Scouts", JSON.stringify(scouts))
        this.snack.open("Scouts Fetched Succesfully", "Dismiss", {
          duration: 3000,
        })
      })
      .catch(() => {
        this.snack.open("Couldn't Fetch Scouts", "Dismiss", {
          duration: 3000,
        })
      })
  }

  updateAllTeams() {
    const scouts = JSON.parse(window.localStorage.getItem("Scouts") ?? "[]")
    let teams: string[] = []
    for (const scout of scouts) {
      if (!teams.includes(scout.team)) {
        teams.push(scout.team)
      }
    }
    this.allTeamsWithScouts = teams.sort()
  }
}
