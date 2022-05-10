import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ColumnDefinition } from "../../model/column-definition";
import { Offer } from "../../model/offer";
import { OffersService } from "../../services/offers.service";

@Component({
  selector: "app-offers",
  templateUrl: "./offers.component.html",
  styleUrls: ["./offers.component.css"],
})
export class OffersComponent implements OnInit, AfterViewInit {
  currentItem: Partial<Offer>;
  dataSource: MatTableDataSource<Offer>;
  columns: ColumnDefinition<Offer>[] = [
    { label: "ID", key: "id", hide: true, type: "number" },
    {
      label: "Title",
      key: "title",
      type: "text",
      required: true,
      maxlength: 80,
    },
    { label: "Description", key: "description", type: "text" },
    {
      label: "Points",
      key: "points",
      type: "number",
      required: true,
      min: 0,
      max: 100,
    },
    { label: "Business ID", key: "businessId", type: "number" },
  ];
  displayedColumns = [...this.columns.map(item => item.key), "actions"];

  @ViewChild("offersForm", { static: false })
  offersForm!: NgForm;

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private offersService: OffersService) {
    this.currentItem = {};
    this.dataSource = new MatTableDataSource<Offer>();
  }

  get isEditMode() {
    return !!this.currentItem.id;
  }

  ngOnInit() {
    this.getAllOffers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllOffers() {
    this.offersService.getAll().subscribe(response => {
      this.dataSource.data = response;
    });
  }

  editOffer(item: Offer) {
    this.currentItem = { ...item };
  }

  cancelEdit() {
    this.currentItem = {};
    this.offersForm.resetForm();
  }

  deleteOffer(item: Offer) {
    this.offersService.delete(item).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter(current => {
        return current.id !== item.id;
      });
    });
  }

  createOffer(item: Offer) {
    this.offersService.create(item).subscribe(response => {
      this.dataSource.data = [...this.dataSource.data, response];
    });
  }

  updateOffer(item: Offer) {
    this.offersService.update(item).subscribe(response => {
      this.dataSource.data = this.dataSource.data.map(current => {
        if (current.id === item.id) return response;
        return current;
      });
    });
  }

  handleSubmit() {
    if (!this.offersForm.form.valid) return;
    const offer = this.currentItem as Offer;
    if (this.isEditMode) {
      this.updateOffer(offer);
    } else {
      this.createOffer(offer);
    }
    this.cancelEdit();
  }
}
