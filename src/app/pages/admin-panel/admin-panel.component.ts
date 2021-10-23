import { Component, OnInit } from "@angular/core"
import { collection, Firestore, onSnapshot } from "@angular/fire/firestore"
import { MatCheckboxChange } from "@angular/material/checkbox"
import { doc, setDoc } from "@firebase/firestore"
import User from "app/models/user.model"

@Component({
  selector: "app-admin-Panel",
  templateUrl: "./admin-Panel.component.html",
  styleUrls: ["./admin-Panel.component.scss"],
})
export class AdminPanelComponent implements OnInit {
  users: User[] = []
  admins: string[] = []
  columns = ["selection", "name"]

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    onSnapshot(doc(this.firestore, "admin/admins"), (snapshot) => {
      this.admins = snapshot.data()?.users ?? []
      console.log(this.admins)
    })

    onSnapshot(collection(this.firestore, "users"), (snapshot) => {
      this.users = snapshot.docs.map((document) => {
        const data = document.data()
        return { uid: document.ref.id, name: data.name, photo: data.photo }
      })
      console.log(this.users)
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
