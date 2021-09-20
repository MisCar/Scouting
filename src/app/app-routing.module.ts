import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { FormComponent } from "./components/form/form.component"
import { FunZoneComponent } from "./pages/fun-zone/fun-zone.component"
import { SimonComponent } from "./pages/fun-zone/simon/simon.component"

const routes: Routes = [
  {
    path: "fun-zone",
    component: FunZoneComponent,
  },
  {
    path: "fun-zone/simon",
    component: SimonComponent,
  },
  {
    path: "**",
    component: FormComponent,
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
