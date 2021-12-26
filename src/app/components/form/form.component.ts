import { Component, OnInit } from "@angular/core"
import {
  Firestore,
  doc,
  onSnapshot,
  setDoc,
  getDoc,
} from "@angular/fire/firestore"
import Schema from "app/models/schema.model"
import { storagePrefix } from "app/utilities/widget"
import { MatSnackBar } from "@angular/material/snack-bar"
import { AuthenticationService } from "app/services/authentication.service"
import {
  TBAEvents,
  TheBlueAllianceService,
} from "app/services/the-blue-alliance.service"
import { MatSelectChange } from "@angular/material/select"
import { BackendService } from "app/services/backend.service"

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
  /** The competition stage (qualifications, quarterfinals, etc.) the scout is about */
  stage?: string
  /** The game number the scout is about */
  game?: number
  /** The team number the scout is about */
  team?: number

  blueTeams: number[] = []
  redTeams: number[] = []

  /** The events your team is competing at */
  events: TBAEvents = []

  constructor(
    private firestore: Firestore,
    private snack: MatSnackBar,
    public authentication: AuthenticationService,
    private tba: TheBlueAllianceService,
    public backend: BackendService
  ) {
    this.schema = {
      sections: [],
    }

    onSnapshot(doc(firestore, "admin/schema"), (snapshot) => {
      const schema = snapshot.data() as Schema
      this.schema = schema
      window.localStorage.removeItem("Schema")
      window.localStorage.setItem("Schema", JSON.stringify(schema))
    })

    this.events = this.tba
      .getEvents()
      .filter((event) => new Date(event.end_date).getFullYear() > 2019)
  }

  /** Bindings */

  onStageChange(event: MatSelectChange) {
    this.stage = event.value
    this.showTeams()
  }

  onGameChanged(event: KeyboardEvent): void {
    const value = (event.target as HTMLInputElement).value
    if (value !== "") {
      this.game = Number(value)
      this.showTeams()
    }
  }

  onTeamChanged(event: Event): void {
    this.team = Number((event.target as HTMLInputElement).value)
  }

  /** Actions */

  clear(): void {
    this.team = undefined
    this.game = undefined
    this.redTeams = []
    this.blueTeams = []
    window.dispatchEvent(new Event("formclear"))
  }

  get scout(): Scout {
    const result: Scout = {}
    const schema = JSON.parse(localStorage.getItem("Schema") ?? "")
    let keys = []
    let sections = []
    for (let section of schema["sections"]) {
      console.log(section)
      sections.push(section["prefix"])
      for (let widget of section["widgets"]) {
        console.log(widget)
        keys.push(widget["key"])
      }
    }

    for (let i = 0; i < localStorage.length; i++) {
      let fullKey = localStorage.key(i)
      if (!fullKey?.startsWith(storagePrefix)) {
        continue
      }

      const value = JSON.parse(localStorage.getItem(fullKey)!)
      fullKey = fullKey.substring(storagePrefix.length)

      const prefix = fullKey.substring(0, fullKey.indexOf(" "))

      if (!sections.includes(prefix)) {
        continue
      }

      if (!Object.keys(result).includes(prefix)) {
        result[prefix] = {}
      }

      const key = fullKey.substring(prefix.length + 1)
      if (keys.includes(key)) {
        result[prefix][key] = value
      }
    }

    return result
  }

  copy(): void {
    navigator.clipboard.writeText(JSON.stringify(this.scout, null, 2))
  }

  save(): void {
    const link = document.createElement("a")
    link.href = URL.createObjectURL(
      new Blob([JSON.stringify(this.scout, null, 4)], {
        type: "application/json",
      })
    )
    link.download = "submission.json"
    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  get filled() {
    return (
      this.stage !== undefined &&
      this.game !== undefined &&
      this.team !== undefined
    )
  }

  send(): void {
    if (!this.filled) {
      this.snack.open(
        "You must enter the stage, game and team number before submitting your scout",
        "Dismiss",
        { duration: 3000 }
      )
      return
    }

    setDoc(
      doc(
        this.firestore,
        `${this.backend.event}/${this.stage} ${this.game} ${this.team}`
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

  open(): void {
    const input = document.createElement("input")
    input.type = "file"
    input.style.display = "none"
    document.body.appendChild(input)
    input.click()
    input.onchange = () => {
      const file = input.files![0]
      const reader = new FileReader()
      reader.onload = () => {
        const data = JSON.parse(reader.result as string)
        this.set(data)
      }
      reader.readAsText(file)
      document.body.removeChild(input)
    }
  }

  showTeams() {
    this.redTeams = []
    this.blueTeams = []
    if (
      this.backend.event === undefined ||
      this.stage === undefined ||
      this.game === undefined
    ) {
      return
    }

    const [redTeams, blueTeams] = this.tba.getTeams(
      this.backend.event,
      this.stage,
      this.game
    )

    this.redTeams = redTeams
    this.blueTeams = blueTeams
  }

  async fetchScout(): Promise<void> {
    const document = await getDoc(
      doc(
        this.firestore,
        `${this.backend.event}/${this.stage} ${this.game} ${this.team}`
      )
    )

    if (!document.exists()) {
      this.snack.open("Scout Not Available", "Dismiss", { duration: 3000 })
      return
    }

    const data = document.data()
    this.set(data)
  }

  set(data: Scout): void {
    for (const prefix in data) {
      for (const key in data[prefix]) {
        const actualKey = storagePrefix + prefix + " " + key
        const newValue = JSON.stringify(data[prefix][key])
        localStorage.setItem(actualKey, newValue)
        window.dispatchEvent(
          new StorageEvent("storage", { key: actualKey, newValue })
        )
      }
    }
  }

  ngOnInit(): void {
    this.schema = JSON.parse(localStorage.getItem("Schema") ?? "{}")
  }
}
