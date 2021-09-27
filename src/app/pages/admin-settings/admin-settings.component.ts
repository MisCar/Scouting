import { Firestore } from "@angular/fire/firestore"
import { Component, OnInit } from "@angular/core"
import { collection, doc, getDocs } from "firebase/firestore"
import {
  Events,
  TheBlueAllianceService,
} from "app/services/the-blue-alliance.service"

@Component({
  selector: "app-admin-settings",
  templateUrl: "./admin-settings.component.html",
  styleUrls: ["./admin-settings.component.scss"],
})
export class AdminSettingsComponent implements OnInit {
  ngOnInit(): void {}

  events: Events = []

  game: number

  stage: string

  event: string

  constructor(
    private firestore: Firestore,
    private tba: TheBlueAllianceService
  ) {
    this.tba.getEvents().then((events) => {
      this.events = events.filter(
        (event) => new Date(event.end_date).getFullYear() > 2019
      )
    })

    this.event = ""
    this.stage = ""
    this.game = 1
  }

  onGameChanged(event: Event): void {
    this.game = Number((event.target as HTMLInputElement).value)
  }

  getTeams() {
    this.tba.getTeams(this.event)
  }

  async getData() {
    const document = await getDocs(collection(this.firestore, "undefined"))
    const scouts = document.docs
    let scoutsString: any = null
    for (let scout of scouts) {
      let scouter = this.convertToCSV(scout.data())
      console.log(scouter)
    }
    console.log(scoutsString)
  }

  convertToCSV(objArray: any) {
    var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray
    console.log(array)
    var str = ""
    console.log("len " + array.length)
    for (var i = 0; i < array.length; i++) {
      var line = ""
      for (var index in array[i]) {
        if (line != "") line += ","

        line += array[i][index]
        console.log("line " + line)
      }

      str += line + "\r\n"
    }

    return str
  }
}
