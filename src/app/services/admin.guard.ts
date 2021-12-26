import { Injectable } from "@angular/core"
import { MatSnackBar } from "@angular/material/snack-bar"
import { CanActivate, UrlTree } from "@angular/router"
import { Observable } from "rxjs"
import { AuthenticationService } from "./authentication.service"

@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  constructor(
    private authentication: AuthenticationService,
    private snack: MatSnackBar
  ) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.authentication.isAdmin) {
      this.snack.open("You aren't an admin!", "Dismiss", { duration: 3000 })
      return false
    }
    return true
  }
}
