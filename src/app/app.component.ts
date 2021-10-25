import { Component } from "@angular/core"
import { Firestore } from "@angular/fire/firestore"
import { AuthenticationService } from "./services/authentication.service"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "Scouting"

  constructor(
    public authentication: AuthenticationService,
    private firestore: Firestore
  ) {}
}
