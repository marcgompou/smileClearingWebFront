import { Component, OnInit } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { fuseAnimations } from "@fuse/animations";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: fuseAnimations,
})
export class AppComponent implements OnInit {
  constructor(public _MatPaginatorIntl: MatPaginatorIntl) {}

  ngOnInit() {
    this._MatPaginatorIntl.lastPageLabel = "Dernière page";
    this._MatPaginatorIntl.firstPageLabel = "Première page";
    this._MatPaginatorIntl.previousPageLabel = "Page précédente";
    this._MatPaginatorIntl.nextPageLabel = "Page suivante";
    this._MatPaginatorIntl.itemsPerPageLabel = "Nombre d'élément par page";
    this._MatPaginatorIntl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      if (length === 0 || pageSize === 0) {
        return `0 à ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} sur ${length}`;
    };
  }
}
