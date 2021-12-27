import { NgModule } from "@angular/core"
import { initializeApp, provideFirebaseApp } from "@angular/fire/app"
import { getAuth, provideAuth } from "@angular/fire/auth"
import {
  enableIndexedDbPersistence,
  getFirestore,
  provideFirestore,
} from "@angular/fire/firestore"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatSelectModule } from "@angular/material/select"
import { MatSlideToggleModule } from "@angular/material/slide-toggle"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatSnackBarModule } from "@angular/material/snack-bar"
import { MatBadgeModule } from "@angular/material/badge"
import { MatTableModule } from "@angular/material/table"
import { BrowserModule } from "@angular/platform-browser"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { ServiceWorkerModule } from "@angular/service-worker"
import { environment } from "../environments/environment"
import config from "../environments/firebase.json"
import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { CounterComponent } from "./components/form/counter/counter.component"
import { FormComponent } from "./components/form/form.component"
import { TextComponent } from "./components/form/text/text.component"
import { TimerComponent } from "./components/form/timer/timer.component"
import { ToggleComponent } from "./components/form/toggle/toggle.component"
import { WidgetRowComponent } from "./components/form/widget-row/widget-row.component"
import { SimonComponent } from "./pages/fun-zone/simon/simon.component"
import { LongPressDirective } from "./directives/long-press.directive"
import { LeaderboardComponent } from "./pages/fun-zone/leaderboard/leaderboard.component"
import { FunZoneComponent } from "./pages/fun-zone/fun-zone.component"
import { HttpClientModule } from "@angular/common/http"
import { AdminPanelComponent } from "./pages/admin-panel/admin-panel.component"
import { MatListModule } from "@angular/material/list"
import { ScoutOverviewComponent } from "./pages/admin-panel/scout-overview/scout-overview.component"
import { SchemaEditorComponent } from "./pages/admin-panel/schema-editor/schema-editor.component"
import { TeamScoutsComponent } from "./pages/admin-panel/scout-overview/team-scouts/team-scouts.component"
import { MatchesComponent } from "./pages/fun-zone/matches/matches.component"

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    CounterComponent,
    LongPressDirective,
    TextComponent,
    ToggleComponent,
    TimerComponent,
    WidgetRowComponent,
    SimonComponent,
    LeaderboardComponent,
    FunZoneComponent,
    AdminPanelComponent,
    ScoutOverviewComponent,
    SchemaEditorComponent,
    TeamScoutsComponent,
    MatchesComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(config)),
    provideFirestore(() => {
      const firestore = getFirestore()
      enableIndexedDbPersistence(firestore)
      return firestore
    }),
    provideAuth(() => getAuth()),
    //provideAuth(getAuth),
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatTableModule,
    MatListModule,
    MatBadgeModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: "registerWhenStable:30000",
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
