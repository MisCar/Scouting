import { Injectable } from "@angular/core"
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  Auth,
} from "@angular/fire/auth"
import { Firestore } from "@angular/fire/firestore"
import { MatSnackBar } from "@angular/material/snack-bar"
import { User } from "@firebase/auth"
import { doc, getDoc, onSnapshot, setDoc } from "@firebase/firestore"

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  public user?: User
  public isAdmin = true

  constructor(
    private firestore: Firestore,
    private authentication: Auth,
    private snack: MatSnackBar
  ) {
    onAuthStateChanged(this.authentication, async (user) => {
      this.user = user ?? undefined

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
    signInWithPopup(this.authentication, new GoogleAuthProvider())
      .then((credential) => {
        if (credential !== undefined) {
          setDoc(
            doc(this.firestore, `users/${credential.user.uid}`),
            {
              name: credential.user.displayName,
              photo: credential.user.photoURL,
            },
            { merge: true }
          )
        }
      })
      .catch((error) => {
        this.snack.open("Could not log in because of a " + error, "Dismiss", {
          duration: 3000,
        })
      })
  }

  signOut(): void {
    if (window.confirm("Are you sure you want to sign out?")) {
      signOut(this.authentication)
    }
  }
}
