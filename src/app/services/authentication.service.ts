import { Injectable } from "@angular/core"
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  Auth,
} from "@angular/fire/auth"
import { MatSnackBar } from "@angular/material/snack-bar"
import { User } from "@firebase/auth"

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  public user?: User

  constructor(private authentication: Auth, private snack: MatSnackBar) {
    onAuthStateChanged(this.authentication, (user) => {
      this.user = user ?? undefined
    })
  }

  get signedIn(): boolean {
    return this.user !== undefined
  }

  signIn(): void {
    signInWithPopup(this.authentication, new GoogleAuthProvider()).catch(
      (error) => {
        this.snack.open("Could not log in because of a " + error)
      }
    )
  }

  signOut(): void {
    if (window.confirm("Are you sure you want to sign out?")) {
      signOut(this.authentication)
    }
  }
}
