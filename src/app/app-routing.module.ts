import { AdminPanelComponent } from "./pages/admin-panel/admin-panel.component"
import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { LeaderboardComponent } from "./pages/fun-zone/leaderboard/leaderboard.component"
import { FunZoneComponent } from "./pages/fun-zone/fun-zone.component"
import { SimonComponent } from "./pages/fun-zone/simon/simon.component"
import { FormComponent } from "./components/form/form.component"
import { ScoutOverviewComponent } from "./pages/admin-panel/scout-overview/scout-overview.component"
import { SchemaEditorComponent } from "./pages/admin-panel/schema-editor/schema-editor.component"
import { AdminGuard } from "./services/admin.guard"
import { TeamScoutsComponent } from "./pages/admin-panel/scout-overview/team-scouts/team-scouts.component"
import { MatchesComponent } from "./pages/fun-zone/matches/matches.component"

const routes: Routes = [
  { path: "", redirectTo: "/form", pathMatch: "full" },
  { path: "fun-zone", component: FunZoneComponent },
  { path: "fun-zone/leaderboard", component: LeaderboardComponent },
  { path: "fun-zone/simon", component: SimonComponent },
  {
    path: "fun-zone/matches",
    component: MatchesComponent,
  },
  { path: "form", component: FormComponent },
  {
    path: "admin-panel",
    component: AdminPanelComponent,
    canActivate: [AdminGuard],
  },
  {
    path: "admin-panel/scout-overview",
    component: ScoutOverviewComponent,
    canActivate: [AdminGuard],
  },
  {
    path: "admin-panel/scout-overview/team",
    component: TeamScoutsComponent,
    canActivate: [AdminGuard],
  },
  {
    path: "admin-panel/schema-editor",
    component: SchemaEditorComponent,
    canActivate: [AdminGuard],
  },
  {
    path: "fun-zone/team-games",
    component: MatchesComponent,
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
