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
import { MatStepperModule } from "@angular/material/stepper"

import { ReactiveFormsModule } from "@angular/forms"

import config from "../environments/firebase.json"
import { FormComponent } from "./components/form/form.component"
import { CounterComponent } from "./components/form/counter/counter.component"
import { MatIconModule } from "@angular/material/icon"
import { LongPressDirective } from "./directives/long-press.directive"

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    CounterComponent,
    LongPressDirective,
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
    MatStepperModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
