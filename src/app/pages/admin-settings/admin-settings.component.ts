import { Firestore } from "@angular/fire/firestore"
import { Component, OnInit } from "@angular/core"
import { collection, doc, getDocs } from "firebase/firestore"

@Component({
  selector: "app-admin-settings",
  templateUrl: "./admin-settings.component.html",
  styleUrls: ["./admin-settings.component.scss"],
})
export class AdminSettingsComponent implements OnInit {
  constructor(private firestore: Firestore) {}

  ngOnInit(): void {}

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
