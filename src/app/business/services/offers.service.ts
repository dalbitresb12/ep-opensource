import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { environment } from "src/environments/environment";
import { catchError, Observable, retry, throwError } from "rxjs";
import { Offer } from "../model/offer";

@Injectable({
  providedIn: "root",
})
export class OffersService {
  private basePath = `${environment.apiUrlBase}/offers`;

  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  constructor(private http: HttpClient) {}

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error(
        `An error ocurred ${error.status}, body was ${error.error}`
      );
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: ${error.error}`
      );
    }
    return throwError(
      () =>
        new Error("Something happened with request, please try again later.")
    );
  }

  create(item: Offer): Observable<Offer> {
    return this.http
      .post<Offer>(this.basePath, JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getAll(): Observable<Offer[]> {
    return this.http
      .get<Offer[]>(this.basePath, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getById(id: number): Observable<Offer> {
    return this.http
      .get<Offer>(`${this.basePath}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  update(item: Offer): Observable<Offer> {
    if (!item.id)
      throw new Error(
        `Offer is missing id property, unable to update. Body was ${item}`
      );
    return this.http
      .put<Offer>(
        `${this.basePath}/${item.id}`,
        JSON.stringify(item),
        this.httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  delete(item: Offer): Observable<Offer> {
    if (!item.id)
      throw new Error(
        `Offer is missing id property, unable to delete. Body was ${item}`
      );
    return this.http
      .delete<Offer>(`${this.basePath}/${item.id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  count(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.http
        .get<Offer[]>(`${this.basePath}?_start=0&_end=0`, {
          observe: "response",
          ...this.httpOptions,
        })
        .pipe(
          retry(2),
          catchError(err => {
            reject(err);
            return this.handleError(err);
          })
        )
        .subscribe(res =>
          resolve(Number(res.headers.get("X-Total-Count") || 0))
        );
    });
  }
}
