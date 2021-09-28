import { Component, OnInit, Input, ViewChild } from "@angular/core"
import { Firestore, doc, onSnapshot, setDoc } from "@angular/fire/firestore"
import Schema from "app/models/schema.model"
import { storagePrefix } from "app/utilities/widget"
import { MatSnackBar } from "@angular/material/snack-bar"
import { AuthenticationService } from "app/services/authentication.service"
import {
  Events,
  TheBlueAllianceService,
} from "app/services/the-blue-alliance.service"

interface Scout {
  [keyof: string]: {
    [keyof: string]: any
  }
}

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"],
})
export class FormComponent implements OnInit {
  /** The schema of the scouting form */
  schema: Schema
  /** The code of the event the user is scouting */
  event?: string
  /** The competition stage (qualifications, quarterfinals, etc.) the scout is about */
  stage?: string
  /** The game number the scout is about */
  game?: number
  /** The team number the scout is about */
  team?: number

  /** The events your team is competing at */
  events: Events = []

  constructor(
    private firestore: Firestore,
    private snack: MatSnackBar,
    public authentication: AuthenticationService,
    private tba: TheBlueAllianceService
  ) {
    this.schema = {
      sections: [],
    }

    onSnapshot(doc(firestore, "admin/schema"), (snapshot) => {
      this.schema = snapshot.data() as Schema
    })

    this.tba.getEvents().then((events) => {
      this.events = events.filter(
        (event) => new Date(event.end_date).getFullYear() > 2019
      )
    })
  }

  /** Bindings */

  onGameChanged(event: Event): void {
    this.game = Number((event.target as HTMLInputElement).value)
  }

  onTeamChanged(event: Event): void {
    this.team = Number((event.target as HTMLInputElement).value)
  }

  /** Actions */

  clear(): void {
    window.dispatchEvent(new Event("formclear"))
  }

  get scout(): Scout {
    const result: Scout = {}
    for (let i = 0; i < localStorage.length; i++) {
      let fullKey = localStorage.key(i)
      if (!fullKey?.startsWith(storagePrefix)) {
        continue
      }

      const value = JSON.parse(localStorage.getItem(fullKey)!)
      fullKey = fullKey.substring(storagePrefix.length)

      const prefix = fullKey.substring(0, fullKey.indexOf(" "))

      if (!Object.keys(result).includes(prefix)) {
        result[prefix] = {}
      }

      const key = fullKey.substring(prefix.length + 1)

      result[prefix][key] = value
    }

    return result
  }

  copy(): void {
    navigator.clipboard.writeText(JSON.stringify(this.scout, null, 2))
  }

  save(): void {
    const link = document.createElement("a")
    link.href = URL.createObjectURL(
      new Blob([JSON.stringify(this.scout, null, 4)], { type: "text/plain" })
    )
    link.download = "submission.json"
    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  send(): void {
    setDoc(
      doc(
        this.firestore,
        `${this.event}/${this.stage} ${this.game} ${this.team}`
      ),
      this.scout,
      {
        merge: true,
      }
    )
      .then(() => {
        this.snack.open("Submission Received", "Dismiss", {
          duration: 3000,
        })
      })
      .catch(() => {
        this.snack.open("Couldn't Send Submission", "Dismiss", {
          duration: 3000,
        })
      })
  }

  ngOnInit(): void {
    localStorage.clear()
  }
}
