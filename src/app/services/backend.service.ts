import { Injectable } from "@angular/core"
import { Firestore, doc, onSnapshot, setDoc } from "@angular/fire/firestore"

@Injectable({
  providedIn: "root",
})
export class BackendService {
  private _event = ""

  constructor(private firestore: Firestore) {
    this._event = localStorage.getItem("Event Key") ?? ""

    onSnapshot(doc(this.firestore, "/admin/event"), (snapshot) => {
      this._event = snapshot.data()?.key ?? ""
      localStorage.setItem("Event Key", this._event)
    })
  }

  get event() {
    return this._event
  }

  set event(newEvent: string) {
    setDoc(doc(this.firestore, "/admin/event"), { key: newEvent })
  }
}
