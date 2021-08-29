import { Component, OnInit } from "@angular/core"
import { Firestore, doc, onSnapshot, setDoc } from "@angular/fire/firestore"
import Schema from "app/models/schema.model"
import { storagePrefix } from "app/utilities/widget"
import { MatSnackBar } from "@angular/material/snack-bar"

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
  schema: Schema
  event = "event"
  level = "qm"
  game = 15
  team = 1574

  constructor(private firestore: Firestore, private snack: MatSnackBar) {
    this.schema = {
      sections: [],
    }
    onSnapshot(doc(firestore, "admin/schema"), (snapshot) => {
      this.schema = snapshot.data() as Schema
    })
  }

  ngOnInit(): void {}

  copy(): void {
    const values = this.getValues()
    navigator.clipboard.writeText(JSON.stringify(values, null, 2))
  }

  save(): void {
    const values = this.getValues()
    const link = document.createElement("a")
    link.href = URL.createObjectURL(
      new Blob([JSON.stringify(values, null, 4)], { type: "text/plain" })
    )
    link.download = "submission.json"
    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  clear(): void {
    dispatchEvent(new Event("formclear"))
  }

  send(): void {
    setDoc(
      doc(this.firestore, `${this.event}/${this.level}${this.game} ${this.team}`),
      this.getValues(),
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

  getValues(): Scout {
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
}
