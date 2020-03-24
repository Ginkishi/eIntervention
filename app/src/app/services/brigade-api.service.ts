import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Vehicule } from "../models/vehicule";
import { Observable } from "rxjs";
import { Pompier } from "../models/pompier";
import { Droit } from "../models/droit";
import { TypeIntervention } from "../models/typeIntervention";



@Injectable({
  providedIn: "root"
})
export class BrigadeApiService {
  PHP_API_SERVER = "http://localhost/eintervention/api";
  constructor(private httpClient: HttpClient) {}

  readAllVehicule(): Observable<Vehicule[]> {
    return this.httpClient.get<Vehicule[]>(`${this.PHP_API_SERVER}/vehicule`);
  }
  readAllTypeIntervention():Observable<TypeIntervention[]> {
    return this.httpClient.get<TypeIntervention[]>(`${this.PHP_API_SERVER}/typeIntervention`);
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
}
