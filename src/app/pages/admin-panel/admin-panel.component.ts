import { Section } from "app/models/schema.model"
import Schema from "app/models/schema.model"
import { getDoc } from "@firebase/firestore"
import { Firestore } from "@angular/fire/firestore"
import { Component, OnInit } from "@angular/core"
import { collection, getDocs, setDoc, doc } from "firebase/firestore"
import {
  Events,
  TheBlueAllianceService,
} from "app/services/the-blue-alliance.service"
import { FormControl } from "@angular/forms"

@Component({
  selector: "app-admin-Panel",
  templateUrl: "./admin-Panel.component.html",
  styleUrls: ["./admin-Panel.component.scss"],
})
export class AdminPanelComponent implements OnInit {
  async ngOnInit(): Promise<void> {
    await this.getCurrentData()
  }

  hideRequiredControl = new FormControl(true)
  events: Events = []

  stage: string = ""

  event: string = ""

  teams: string[] = []

  missingTeams: string[] = []

  incorrectTeams: string[] = []

  showMissingTeams: boolean = true

  sections: Section[] = []
  schema: Schema = { sections: [] }

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

  async getCurrentData() {
    let schema = await getDoc(doc(this.firestore, "admin/schema1"))
    let data = schema.data()
    for (let section of data?.sections) {
      this.sections.push(section)
    }
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

  addSection() {
    this.sections.push({ title: "", prefix: "", widgets: [] })
  }

  addWidget(section: Section) {
    section.widgets.push({ key: "", label: "", type: "Counter" })
  }

  removeWidget(widgetIndex: number, sectionIndex: number) {
    this.sections[sectionIndex].widgets.splice(widgetIndex, 1)
  }

  removeSection(sectionIndex: number) {
    this.sections.splice(sectionIndex, 1)
  }

  eventToString(event: Event): string {
    return (event.target as HTMLInputElement).value
  }

  eventToNumber(event: Event): number {
    return Number((event.target as HTMLInputElement).value)
  }

  async update() {
    this.schema = { sections: this.sections } as Schema
    await setDoc(doc(this.firestore, "admin/schema1"), this.schema)
  }

  moveWidgetUp(widgetIndex: number, sectionIndex: number) {
    if (widgetIndex == 0) return

    const widget = this.sections[sectionIndex].widgets.splice(widgetIndex, 1)
    this.sections[sectionIndex].widgets.splice(widgetIndex - 1, 0, widget[0])
  }

  moveWidgetDown(widgetIndex: number, sectionIndex: number) {
    if (this.sections[sectionIndex].widgets.length == widgetIndex + 1) return
    const widget = this.sections[sectionIndex].widgets.splice(widgetIndex, 1)
    this.sections[sectionIndex].widgets.splice(widgetIndex + 1, 0, widget[0])
  }

  moveSectionUp(sectionIndex: number) {
    if (sectionIndex == 0) return
    const section = this.sections.splice(sectionIndex, 1)
    this.sections.splice(sectionIndex - 1, 0, section[0])
  }

  moveSectionDown(sectionIndex: number) {
    if (sectionIndex == this.sections.length) return
    const section = this.sections.splice(sectionIndex, 1)
    this.sections.splice(sectionIndex + 1, 0, section[0])
  }
}
