import { Component, OnInit } from "@angular/core";
import { OffersService } from "src/app/business/services/offers.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  count: number = 0;

  constructor(private offersService: OffersService) {}

  ngOnInit() {
    this.offersService.count().then(value => {
      this.count = value;
    });
  }
}
