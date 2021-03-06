import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BrigadeApiService } from '../services/brigade-api.service';
import { Vehicule } from '../models/vehicule';
import { Pompier } from '../models/pompier';
import { Intervention } from '../models/intervention';
import { RightAccessService } from '../services/right-access.service';
import { NumberIntervention } from '../models/numberintervention';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  response: any;
  vehicules: Vehicule[];
  unPompier: Pompier;
  intervention: Intervention[];
  number: NumberIntervention;

  constructor(private apiService: BrigadeApiService, public rights: RightAccessService) { }

  ngOnInit(): void {
    // console.log(localStorage.getItem('setupTime'));

    this.unPompier = JSON.parse(localStorage.getItem('user'));
    this.rights.checkRight();
    this.getInterventions();
    this.getNumberOfIntervention();
  }
  getInterventions() {
    this.apiService
      .readAllInterventionForUser(this.unPompier.P_ID)
      .subscribe((resultat: Intervention[]) => {
        this.response = JSON.parse(JSON.stringify(resultat));
        // console.log(this.response);
        this.intervention = this.response.interventions;
        // console.log(this.intervention);
      });
  }
  getNumberOfIntervention() {
    this.apiService
      .readNumberOfINtervention()
      .subscribe((resultat: NumberIntervention) => {
        this.response = JSON.parse(JSON.stringify(resultat));
        this.number = this.response.Intervention;
        // console.log(this.number);
      });
  }
}
