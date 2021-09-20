import { NgModule } from "@angular/core"
import { initializeApp, provideFirebaseApp } from "@angular/fire/app"
import { getAuth, provideAuth } from "@angular/fire/auth"
import { getFirestore, provideFirestore } from "@angular/fire/firestore"
import { ReactiveFormsModule } from "@angular/forms"
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatSlideToggleModule } from "@angular/material/slide-toggle"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatSnackBarModule } from "@angular/material/snack-bar"
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
import { FunZoneComponent } from "./pages/fun-zone/fun-zone.component"

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
    FunZoneComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(config)),
    provideFirestore(getFirestore),
    provideAuth(getAuth),
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
