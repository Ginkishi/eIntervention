import { Component, OnInit } from "@angular/core";
import { BrigadeApiService } from "../../services/brigade-api.service";
import { TypeIntervention } from "../../models/typeIntervention";
import { Vehicule } from "../../models/vehicule";
import { RoleVhicule } from "../../models/rolevehicule";
import { FormIntervention } from "../../models/formIntervention";
import { DataService } from "src/app/services/data.service";
import { FormBuilder, FormControl, FormGroup, FormArray } from "@angular/forms";
import { formatDate } from "@angular/common";
import { ProfilComponent } from "src/app/profil/profil.component";
import { Pompier } from "src/app/models/pompier";
import { VehiculeUtilise } from "src/app/models/vehiculeutilise";
import { NotExpr } from '@angular/compiler';
import { PompierRoles } from 'src/app/models/pompierRoles';
import { stringify } from 'querystring';
import { ActivatedRoute } from "@angular/router";
import { Intervention } from 'src/app/models/intervention';
import { PersonnelIntervention } from 'src/app/models/personnelIntervention';
import { VehiculeIntervention } from 'src/app/models/vehiculeIntervention';
import { Modification } from 'src/app/models/modification';
import { Router} from "@angular/router";
@Component({
  selector: "app-intervention-edit",
  templateUrl: "./intervention-edit.component.html",
  styleUrls: ["./intervention-edit.component.scss"]
})
export class InterventionEditComponent implements OnInit {
  idIntervention: number;
  response: any;
  intervention: Intervention;
  responsable: Pompier;
  status:number;
  button1:string="Sauvegarder";
  button2:string="Valider";
  createur:boolean;
  AddInterventionForm: FormGroup = new FormGroup({
 
  });
  interventionForm: FormIntervention = {
    numeroIntervention: 2515, //temporaire
    commune: "boumerdes",
    adresse: null,
    typeIntervention: null,
    requerant: "Alerte locale",
    opm: 0,
    important: 0,
    dateDeclenchement: "2020-03-31",
    heureDeclenchement: "16:52",
    dateFin: "2020-03-31",
    heureFin: "16:52",
    // ici faudra recuper l'id de la session
    responsable: "admin admin",
    idcreateur: "1",
    statut:0
  };

  VehiculeUtilise: VehiculeUtilise = {
    IdVehicule: null,
    IDIntervention: null,
    DateDepart: null,
    HeureDepart: null,
    DateArrive: null,
    HeureArrive: null,
    DateRetour: null,
    HeureRetour: null,
    Ronde: null
  };

  listePompier: string[] = [];
  typesIntervention: TypeIntervention[];
  vehicules: Vehicule[];
  selectedvehicule: string = "";
  usedVehicule: RoleVhicule[];
  interventionID: string;
  get vehiculesintervention(): FormArray {

    return <FormArray>this.AddInterventionForm.get('vehiculesintervention');
  }
  get roles(): FormArray {
    return <FormArray>this.vehiculesintervention.get('roles');
  }

  constructor(
    private apiService: BrigadeApiService,
    private dataService: DataService,
    private fb: FormBuilder,
    public routeActive: ActivatedRoute,
    private router: Router
  ) { }
  getID() {
    this.idIntervention = this.routeActive.snapshot.params.id;
  }
  ngOnInit(): void {
    this.AddInterventionForm = this.fb.group({
      numeroIntervention: 258,
      commune: "",
      adresse: "",
      typeIntervention: "",
      requerant: "Alerte locale",
      opm: false,
      important: false,
      dateDeclenchement: formatDate(
        new Date(),
        "yyyy-MM-dd",
        "fr-FR"
      ),
      heureDeclenchement: formatDate(
        new Date(),
        "shortTime",
        "fr-FR"
      ),
      dateFin: formatDate(
        new Date(),
        "yyyy-MM-dd",
        "fr-FR"
      ),
      heureFin: formatDate(
        new Date(),
        "shortTime",
        "fr-FR"
      ),

      vehiculesintervention: this.fb.array([this.buildVehicule()]),
      responsable: 'admin admin',
      modification:"",
      remarque:""
    });
    this.getID();
    // this.getInformation();
    this.apiService
      .readOneIntervention(this.idIntervention)
      .subscribe((resultat: Intervention) => {
        this.response = JSON.parse(JSON.stringify(resultat));
        //console.log(this.response);
        this.intervention = this.response.intervention[0];
        this.apiService
          .readOnePompier(this.intervention.IDResponsable)
          .subscribe((res: Pompier) => {
            this.response = JSON.parse(JSON.stringify(res));
            this.responsable = this.response.pompier[0];
             let op:boolean;
             let im:boolean;
             if(this.intervention.OPM==1)
             op=true;
             else op=false;
            
             if(this.intervention.Important==1)
             im=true;
             else im=false;

            let splitteddatedeclenchement = this.intervention.DateDeclenchement.toString().split(" ");
            let splitteddatedefin = this.intervention.DateFin.toString().split(" ");
            this.AddInterventionForm = this.fb.group({
              numeroIntervention: this.intervention.NIntervention,
              commune: this.intervention.Commune,
              adresse: this.intervention.Adresse,
              typeIntervention: this.intervention.TypeIntervention,
              requerant: this.intervention.Requerant,
              opm: op,
              important: im,
              dateDeclenchement: splitteddatedeclenchement[0],
              heureDeclenchement: splitteddatedeclenchement[1],
              dateFin: splitteddatedefin[0],
              heureFin: splitteddatedefin[1],
              vehiculesintervention: this.fb.array([]),
              responsable: this.responsable.P_PRENOM + " " + this.responsable.P_NOM,
              modification:null,
              remarque:null
            });
            this.interventionForm.idcreateur = ""+this.responsable.P_ID;
               if(this.responsable.P_ID=== JSON.parse(localStorage.getItem("user")).P_ID)
               this.createur=true;
               else
               this.createur=false;
            
                if(this.createur==true){
                  // afficher les remarque

                  let modif:Modification= new Modification();
                this.dataService.getRemarques(this.idIntervention).subscribe(
                  result => 
                  {// console.log("--------------resutl171",result);
                       this.AddInterventionForm.patchValue({
                     remarque:  JSON.parse(JSON.stringify(result)).modification
                  });
                    console.log("success", JSON.parse(JSON.stringify(result)));
                  },
                  error => console.log("erreur", error)
                );
                }
                if(this.createur==true)
                {
                  this.button1="Sauvegarder";
                  this.button2="Valider"
                }
                else
                {
                  this.button1="Demander modification";
                  this.button2="Valider"

                }
            this.populatevehicules(this.intervention.Vehicules);
          }
          );
      });


 
  
    // this.datepipe.transform(this.interventionForm.dateDeclenchement,'dd/MM/yyyy');

    this.createListTypeIntervention();
    this.setIDintervention();
    this.createListVehicule();
    this.createListAllPompier();
  }
  populatevehicules(liste: VehiculeIntervention[]) {

    for (let i = 0; i < liste.length; i++) {


      const control = (<FormArray>this.AddInterventionForm.get('vehiculesintervention')) as FormArray;
     // console.log('-------', control);
      control.push(this.buildedVehicule(liste[i]));
      this.populatevehicule(liste[i].Personnels, i);

    }

  }
  buildedVehicule(v: VehiculeIntervention): FormGroup {

    let splitedatedepart = v.DateDepart.toString().split(" ");
    let spliteddatearrivee = v.DateArrive.toString().split(" ");
    let spliteddateretour = v.DateRetour.toString().split(" ");
    let ron:boolean;
    if(v.Ronde==1)
      ron=true;
    else
      ron=false;
    return this.fb.group({
      vehicule: v.IDVehicule,
      ronde: ron,
      dateDepart: splitedatedepart[0],
      heureDepart: splitedatedepart[1],
      dateArrivee: spliteddatearrivee[0],
      heureArrivee: spliteddatearrivee[1],
      dateRetour: spliteddateretour[0],
      heureRetour: spliteddateretour[1],
      roles: this.fb.array([]),
    });


  }
  populatevehicule(liste: PersonnelIntervention[], index: number) {

    let val:number =0;

    this.usedVehicule = [];
    let c = (<FormArray>this.AddInterventionForm.controls['vehiculesintervention']).at(index).get('roles') as FormArray;
    c.clear();
    let apprenti:PersonnelIntervention;
    const control = (<FormArray>this.AddInterventionForm.controls['vehiculesintervention']).at(index).get('roles') as FormArray;
    //console.log(value);
    for (let i of liste) {


     
      console.log("--------------------------211", i);
      if(i.IDrole!=0)
      control.push(this.buildedRoles(i.IDrole,i.Role,i.Personne));
      else
      {    val++;
         apprenti=i;
      }
   
    }
    if(val!=0)
    {  
      control.push(this.buildedRoles(0,"apprenti(Optionnel)",apprenti.Personne));
    }
    else
    {
      control.push(this.buildedRoles(0,"apprenti(Optionnel)"," "));

    }
    

  }
  buildVehicule(): FormGroup {
    return this.fb.group({
      vehicule: "",
      ronde: false,
      dateDepart: formatDate(
        new Date(),
        "yyyy-MM-dd",
        "fr-FR"
      ),
      heureDepart: formatDate(
        new Date(),
        "shortTime",
        "fr-FR"
      ),
      dateArrivee: formatDate(
        new Date(),
        "yyyy-MM-dd",
        "fr-FR"
      ),
      heureArrivee: formatDate(
        new Date(),
        "shortTime",
        "fr-FR"
      ),
      dateRetour: formatDate(
        new Date(),
        "yyyy-MM-dd",
        "fr-FR"
      ),
      heureRetour: formatDate(
        new Date(),
        "shortTime",
        "fr-FR"
      ),
      roles: this.fb.array([]),
    });

  }
           
  buildedRoles(IDrole:number,Role:string,Personne:string): FormGroup {


    return this.fb.group(
      {
        roleid: IDrole,
        rolename: Role,
        pompiername: Personne,
      }
    );



  }


  buildRoles(name, id): FormGroup {

    return this.fb.group({
      roleid: id,
      rolename: name,
      pompiername: '',
    });

  }
  addTeam(index: number, value: string) {

    this.usedVehicule = [];
    var val = +value;
    let c = (<FormArray>this.AddInterventionForm.controls['vehiculesintervention']).at(index).get('roles') as FormArray;
    c.clear();
    //console.log(value);
    for (let i of this.vehicules) {
      if (i.V_ID == val) {
        for (let c of i.ROLE) {
          this.usedVehicule.push((new RoleVhicule(c.ROLE_ID, c.ROLE_NAME, '')));
          const control = (<FormArray>this.AddInterventionForm.controls['vehiculesintervention']).at(index).get('roles') as FormArray;
          control.push(this.buildRoles(c.ROLE_NAME, c.ROLE_ID));
        }

      }
    }
    this.usedVehicule.push(new RoleVhicule('0', 'apprenti(Optionel)', ''));
    const control = (<FormArray>this.AddInterventionForm.controls['vehiculesintervention']).at(index).get('roles') as FormArray;
    control.push(this.buildRoles("apprenti(Optionel)", "0"));
  }
  getvalue(value: string){
    if(value=="Sauvegarder")
    {
        this.status=0;
    }
    else if(value=="Valider" )
    { 
      if(this.createur)
     this.status=1;
     else{
      this.status=3;
     }
    }
    else if(value=="Demander modification")
    {
      this.status=2;
    }
    console.log("----------375----------",this.status);
  }
  setIDintervention(): void {

    // recuperer l'id d'une intervention 
    this.dataService.getInterventionID().subscribe((resultat: number) => {
      this.response = JSON.parse(JSON.stringify(resultat));
      let c: number = 1 + Number(this.response.ID);;
      this.interventionID = "" + c;
 //     console.log(this.interventionID);
    });
  }
  createListTypeIntervention(): void {
    this.apiService
      .readAllTypeIntervention()
      .subscribe((resultat: TypeIntervention[]) => {
        //   console.log(resultat);
        this.response = JSON.parse(JSON.stringify(resultat));
        //    console.log(this.response);
        this.typesIntervention = this.response.typeIntervention;
        //console.log(this.typesIntervention[0]);
      });
  }
  createListVehicule(): void {
    this.apiService.readAllVehicule().subscribe((res: Vehicule[]) => {
      this.response = JSON.parse(JSON.stringify(res));
      this.vehicules = this.response.vehicules;
      // console.log(this.vehicules);
    });
  }
  createListAllPompier(): void {
    this.apiService.readAllPompier().subscribe((resultat: Pompier[]) => {
      //   console.log(resultat);
      this.response = JSON.parse(JSON.stringify(resultat));
      for (let i of this.response.pompiers) {
        let c: string = i.P_PRENOM + " " + i.P_NOM;
        this.listePompier.push(c);
      }
    //  console.log(this.listePompier);
      //console.log(this.listePompier);
      //  this.typesIntervention = this.response.typeIntervention;
      //console.log(this.typesIntervention[0]);
    });
  }
  // rajouter l'equipe d'apres le vehicule selectionnée

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("fired"));
   }
  selectEvent(item: string) {
    this.interventionForm.responsable = item;
  }

  addVehicule(): void {

    this.vehiculesintervention.push(this.buildVehicule());
  }
  deleteVehicule(i: number) {
    const control = this.vehiculesintervention as FormArray;
    control.removeAt(i);

  }
  onSubmit() {
   // console.log("---------435------",this.status);
  

    // suppression
    this.dataService.DeleteInterventionID(this.idIntervention).subscribe(

      result => {

        ///ajout
        // console.log(this.AddInterventionForm.value);
      //  console.log('saved'+JSON.stringify(this.AddInterventionForm.value));
       // console.log("-----------numerointer ", this.AddInterventionForm.value.numeroIntervention);

        this.interventionForm.numeroIntervention = this.AddInterventionForm.value.numeroIntervention;
        this.interventionForm.commune = this.AddInterventionForm.value.commune;
        this.interventionForm.adresse = this.AddInterventionForm.value.adresse;
        this.interventionForm.typeIntervention = this.AddInterventionForm.value.typeIntervention;
        this.interventionForm.requerant = this.AddInterventionForm.value.requerant;
        this.interventionForm.opm = this.AddInterventionForm.value.opm;
        console.log(this.AddInterventionForm.value.important);
        this.interventionForm.important = this.AddInterventionForm.value.important;
        this.interventionForm.dateDeclenchement = this.AddInterventionForm.value.dateDeclenchement;
        this.interventionForm.dateFin = this.AddInterventionForm.value.dateFin;
        this.interventionForm.heureDeclenchement = this.AddInterventionForm.value.heureDeclenchement;
        this.interventionForm.heureFin = this.AddInterventionForm.value.heureFin;
        this.interventionForm.responsable = this.AddInterventionForm.value.responsable;
        this.interventionForm.idcreateur = JSON.parse(localStorage.getItem("user")).P_ID;
        this.interventionForm.statut=this.status;

      //  console.log("------------conntent397 ",this.interventionForm);
      //  console.log("in onSubmit:");

        //ajout d'une intervention
        this.dataService.postInterventionForm(this.interventionForm).subscribe(
          result => {
           // console.log("success hallelujah", result);
            var c: VehiculeUtilise;
            for (let vi of this.AddInterventionForm.value.vehiculesintervention) {
             // console.log("vi-------",vi);
              c = {
                IdVehicule: vi.vehicule,
                IDIntervention: this.interventionID,
                DateDepart: vi.dateDepart,
                HeureDepart: vi.heureDepart,
                DateArrive: vi.dateArrivee,
                HeureArrive: vi.heureArrivee,
                DateRetour: vi.dateRetour,
                HeureRetour: vi.heureRetour,
                Ronde: vi.ronde
              };
          
              if(this.status==2) // chef de corps demande modif
              {// console.log("---------526--------");
                let modif:Modification= new Modification();
                modif.Id=this.interventionID;
                modif.modif=this.AddInterventionForm.value.modification;
             //   console.log("--------530----------",modif);
                this.dataService.setRemarques(modif).subscribe(
                  result => 
                  {
                 //   console.log("success", JSON.parse(JSON.stringify(result)));
                  },
                  error => console.log("erreur", error)
                );
             }
             if(this.status==3) // chef de corps valide 
             {
              let modif:Modification= new Modification();
              modif.Id=this.interventionID;
              modif.modif="Intervention peut-etre validée";
              this.dataService.setRemarques(modif).subscribe(
                result => 
                {
                  console.log("successremarque", JSON.parse(JSON.stringify(result)));
                },
                error => console.log("erreur", error)
              );
             }

           
              this.dataService.postVehiculeUsedForm(c).subscribe(
                result => {
                 // console.log("success", JSON.parse(JSON.stringify(result)));

                  for (let pom of vi.roles) {
                  //  console.log(pom);
                   // console.log(c.IdVehicule);
                    if (pom.roleid !== '0' || pom.pompiername != "") {
                     // console.log(pom.roleid);
                      this.dataService.postMembertoInntervention(vi.vehicule, this.interventionID, pom.roleid, pom.pompiername).subscribe(
                        result => {
                   //       console.log("success", JSON.parse(JSON.stringify(result)));
                        },
                        error => console.log("erreur", error)
                      );
                    }
                    else
                     if(pom.roleid=='0' && pom.pompiername!="")
                      {
                      //  console.log(c.IdVehicule,this.interventionID,pom.roleid,pom.pompiername);
                      this.dataService.postMembertoInntervention(c.IdVehicule,this.interventionID,pom.roleid,pom.pompiername).subscribe(
                        result => 
                        {
                        //  console.log("success", JSON.parse(JSON.stringify(result)));
                        },
                        error => console.log("erreur", error)
                      );
                      }
                  
                  }
                },
                error => console.log("erreur", error)
              );

             /////////
             
         


            }
          }

        );


      }
    );
    
    this.delay(2000).then(any=>{
      this.router.navigate(["intervention/"+ this.interventionID]);
 });
   

  }

}


