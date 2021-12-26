import { Component, OnInit } from "@angular/core"
import {
  collection,
  Firestore,
  onSnapshot,
  doc,
  setDoc,
} from "@angular/fire/firestore"
import User from "app/models/user.model"
import { BackendService } from "app/services/backend.service"
import { TheBlueAllianceService } from "app/services/the-blue-alliance.service"

@Component({
  selector: "app-admin-panel",
  templateUrl: "./admin-panel.component.html",
  styleUrls: ["./admin-panel.component.scss"],
})
export class AdminPanelComponent implements OnInit {
  users: User[] = []
  admins: string[] = []
  columns = ["selection", "name"]

  constructor(
    private firestore: Firestore,
    public backend: BackendService,
    public tba: TheBlueAllianceService
  ) {}

  ngOnInit(): void {
    onSnapshot(doc(this.firestore, "admin/admins"), (snapshot) => {
      this.admins = snapshot.data()?.users ?? []
    })

    onSnapshot(collection(this.firestore, "users"), (snapshot) => {
      this.users = snapshot.docs.map((document) => {
        const data = document.data()
        return { uid: document.ref.id, name: data.name, photo: data.photo }
      })
    })
  }

  updateAdmin(uid: string, admin: boolean) {
    if (admin) {
      this.admins.push(uid)
    } else {
      this.admins.splice(this.admins.indexOf(uid), 1)
    }
    setDoc(doc(this.firestore, "admin/admins"), { users: this.admins })
  }
}
