import { Injectable } from "@angular/core"
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  Auth,
} from "@angular/fire/auth"
import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  Firestore,
} from "@angular/fire/firestore"
import { User } from "@angular/fire/auth"
import { MatSnackBar } from "@angular/material/snack-bar"

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  public user?: User
  public isAdmin = false

  constructor(
    private firestore: Firestore,
    private authentication: Auth,
    private snack: MatSnackBar
  ) {
    onAuthStateChanged(this.authentication, async (user) => {
      this.user = user ?? undefined

      if (this.user !== undefined) {
        const document = doc(this.firestore, `users/${this.user.uid}`)
        if (!(await (await getDoc(document)).exists())) {
          setDoc(
            document,
            {
              name: this.user.displayName,
              photo: this.user.photoURL,
            },
            { merge: true }
          )
        }
      }

      const data = (await getDoc(doc(this.firestore, "admin/admins"))).data()
      if (data === undefined) {
        this.isAdmin = false
        return
      }

      this.isAdmin = data.users.includes(this.user?.uid)
    })

    onSnapshot(doc(this.firestore, "admin/admins"), (snapshot) => {
      const data = snapshot.data()
      if (data === undefined) {
        this.isAdmin = false
        return
      }

      this.isAdmin = data.users.includes(this.user?.uid)
    })
  }

  get signedIn(): boolean {
    return this.user !== undefined
  }

  signIn(): void {
    signInWithPopup(this.authentication, new GoogleAuthProvider()).catch(
      (error) => {
        this.snack.open("Could not log in because of a " + error, "Dismiss", {
          duration: 3000,
        })
      }
    )
  }

  signOut(): void {
    if (window.confirm("Are you sure you want to sign out?")) {
      signOut(this.authentication)
    }
  }
}
