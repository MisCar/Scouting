import { Component, OnInit } from "@angular/core"
import { Firestore, doc, onSnapshot } from "@angular/fire/firestore"
import Schema from "app/models/schema.model"

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"],
})
export class FormComponent implements OnInit {
  schema: Schema

  constructor(private firestore: Firestore) {
    this.schema = {
      sections: [],
    }
    onSnapshot(doc(firestore, "admin/schema"), (snapshot) => {
      this.schema = snapshot.data() as Schema
    })
  }

  ngOnInit(): void {}
}
