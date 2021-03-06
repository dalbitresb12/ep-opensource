import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OffersComponent } from "./business/pages/offers/offers.component";
import { HomeComponent } from "./core/pages/home/home.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "home",
  },
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "business/offers",
    component: OffersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
