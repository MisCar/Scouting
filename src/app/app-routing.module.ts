import { AdminSettingsComponent } from "./pages/admin-settings/admin-settings.component"
import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { LeaderboardComponent } from "./pages/fun-zone/leaderboard/leaderboard.component"
import { FunZoneComponent } from "./pages/fun-zone/fun-zone.component"
import { SimonComponent } from "./pages/fun-zone/simon/simon.component"
import { FormComponent } from "./components/form/form.component"
import { SettingsComponent } from "./pages/settings/settings.component"

const routes: Routes = [
  { path: "", redirectTo: "/form", pathMatch: "full" },
  { path: "fun-zone", component: FunZoneComponent },
  { path: "fun-zone/leaderboard", component: LeaderboardComponent },
  { path: "fun-zone/simon", component: SimonComponent },
  { path: "form", component: FormComponent },
  { path: "settings", component: SettingsComponent },
  { path: "admin-settings", component: AdminSettingsComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
