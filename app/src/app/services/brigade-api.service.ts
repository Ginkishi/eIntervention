import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Vehicule } from "../models/vehicule";
import { Observable } from "rxjs";
import { Pompier } from "../models/pompier";
import { Droit } from "../models/droit";

import { User } from "../models/user";

import { TypeIntervention } from "../models/typeIntervention";
import { Intervention } from "../models/intervention";

@Injectable({
  providedIn: "root"
})
export class BrigadeApiService {
  PHP_API_SERVER = "http://localhost/eIntervention/api";
  constructor(private httpClient: HttpClient) {}

  readAllVehicule(): Observable<Vehicule[]> {
    return this.httpClient.get<Vehicule[]>(`${this.PHP_API_SERVER}/vehicule`);
  }
  readAllIntervention(): Observable<Intervention[]> {
    return this.httpClient.get<Intervention[]>(
      `${this.PHP_API_SERVER}/intervention`
    );
  }
  readAllTypeIntervention(): Observable<TypeIntervention[]> {
    return this.httpClient.get<TypeIntervention[]>(
      `${this.PHP_API_SERVER}/typeIntervention`
    );
  }
  readAllPompier(): Observable<Pompier[]> {
    return this.httpClient.get<Pompier[]>(`${this.PHP_API_SERVER}/pompier`);
  }
  readOnePompier(id: number): Observable<Pompier> {
    return this.httpClient.get<Pompier>(`${this.PHP_API_SERVER}/pompier/` + id);
  }
  readOneDroit(id: Droit): Observable<Droit> {
    return this.httpClient.get<Droit>(
      `${this.PHP_API_SERVER}/fonctionnalite/` + id
    );
  }

  authentificate(user: User): Observable<User> {
    return this.httpClient.post<User>(`${this.PHP_API_SERVER}/auth`, user);
  }
}
