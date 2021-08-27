import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"

import { provideFirebaseApp, initializeApp } from "@angular/fire/app"
import { provideFirestore, getFirestore } from "@angular/fire/firestore"
import { provideAuth, getAuth } from "@angular/fire/auth"
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatSnackBarModule } from "@angular/material/snack-bar"

import { ReactiveFormsModule } from "@angular/forms"

import config from "../environments/firebase.json"
import { FormComponent } from "./components/form/form.component"
import { CounterComponent } from "./components/form/counter/counter.component"
import { MatIconModule } from "@angular/material/icon"
import { LongPressDirective } from "./directives/long-press.directive"
import { ServiceWorkerModule } from "@angular/service-worker"
import { environment } from "../environments/environment"
import { TextComponent } from "./components/form/text/text.component"

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    CounterComponent,
    LongPressDirective,
    TextComponent,
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
