import { Firestore } from "@angular/fire/firestore"
import { Component, OnInit } from "@angular/core"
import { collection, getDocs } from "firebase/firestore"
import {
  Events,
  TheBlueAllianceService,
} from "app/services/the-blue-alliance.service"

@Component({
  selector: "app-admin-Panel",
  templateUrl: "./admin-Panel.component.html",
  styleUrls: ["./admin-Panel.component.scss"],
})
export class AdminPanelComponent implements OnInit {
  ngOnInit(): void {}

  events: Events = []

  stage: string = ""

  event: string = ""

  teams: string[] = []

  missingTeams: string[] = []

  incorrectTeams: string[] = []

  showMissingTeams: boolean = true

  constructor(
    private firestore: Firestore,
    private tba: TheBlueAllianceService
  ) {
    this.tba.getEvents().then((events) => {
      this.events = events.filter(
        (event) => new Date(event.end_date).getFullYear() > 2019
      )
    })
  }

  async getTeams(game: number): Promise<string[]> {
    await this.tba.getTeams(this.event, this.stage, game).then((val) => {
      this.teams = val
    })
    return this.teams
  }

  async getScoutsNames(): Promise<string[]> {
    const document = await getDocs(collection(this.firestore, this.event))
    const data = document.docs
    let names: any[] = []
    for (let name of data) {
      if (name.id.includes(this.stage)) names.push(name.id)
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
          this.missingTeams.push(this.stage + " " + i + " " + team)
        }
      }

      for (let team of specificTeams) {
        if (!needTeams.includes(team)) {
          this.incorrectTeams.push(this.stage + " " + i + " " + team)
        }
      }
    }
    this.showMissingTeams = true
  }

  findMaxGameNum(gameNumbers: number[]): number {
    return Math.max(...gameNumbers)
  }
}
