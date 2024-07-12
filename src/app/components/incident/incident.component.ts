import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-incident',
  templateUrl: './incident.component.html',
  styleUrls: ['./incident.component.css']
})
export class IncidentComponent implements OnInit{
  incidents: any[] = [];
  modalOpen: boolean = false;
  incidentFormGroup!:FormGroup;
  isSubmitted:boolean = true;
  reporters :any[] = [];
  ActivatedIncidentNumber : string | null = null;
  constructor(private fb : FormBuilder,private commonService: CommonService) { }

  ngOnInit(): void {
    this.incidentFormGroup = this.fb.group({
      incidentIdentity : [,[Validators.required]],
      reporterId : [,],
      reporterName: ['',[Validators.required,Validators.maxLength(25)]],
      priority : [,[Validators.required,Validators.maxLength(15)]],
      status : [,[Validators.required,Validators.maxLength(15)]],
      description : [,[Validators.required,Validators.maxLength(50)]],
      createNewReporter : [false]
    })
    this.fetchIncidents();
  }
  get f(){
    return this.incidentFormGroup.controls;
  }
  
  shouldDisplayError(controlName: string): boolean {
    const control = this.incidentFormGroup.get(controlName);
    return (control?.invalid && (control.dirty || control.touched) )|| false;
  }

  isNewReporterNameValid(): boolean | null{
    return this.incidentFormGroup.get('newReporterName')?.value.trim().length > 0;
  }

  fetchIncidents() {

    this.commonService.fetchUserIncidents().subscribe({
      next : (response:any)=>{
        this.incidents = response;
      },error : (err:any)=>{

      }
    })
  }

  openModal() {
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  saveIncident() {
    if(this.incidentFormGroup.invalid){
      alert("Please fill all the details");
      return;
    }
    this.commonService.createIncident(this.incidentFormGroup.value).subscribe({
      next : (data:any)=>{
        this.closeModal();
        this.fetchIncidents();
        this.resetForm();
      },error : (error:any)=>{
        alert("Something bad happend!!!");
      }
    });
  }

  editIncident(incident: any) {
    this.openModal();
    this.ActivatedIncidentNumber = incident.incidentNumber;
    this.pathFormValue(incident);
  }
  onEditButtonClick(){
    if(this.incidentFormGroup.invalid){
      alert("fill all the details");
      return;
    };
    if(!this.ActivatedIncidentNumber){
      alert("No incident is selected for editing");
      return;
    }
    this.commonService.updateIncident(Object.assign(this.incidentFormGroup.value,{incidentNumber : this.ActivatedIncidentNumber})).subscribe({
      next : (response:any)=>{
        console.log("Jsjon",JSON.stringify(response));
        this.closeModal();
        this.resetForm();
        this.fetchIncidents();
      },error : (err:any)=>{
        alert("Something went wrong");
      }
    })
  }
  private pathFormValue(incident : any){
    this.incidentFormGroup.patchValue({
      incidentIdentity : incident.incidentIdentity,
      reporterId : incident.reportedId,
      reporterName: incident.reporterName,
      priority : incident.priority,
      status : incident.status,
      description : incident.description,
      createNewReporter :  false
    })
  }

  onReporterOptionClick(name:string){
    this.incidentFormGroup.controls['reporterName'].setValue(name);
    this.incidentFormGroup.controls['createNewReporter'].setValue(false);
  }
  onCreateReporterChange(event:any){
    const ele = event.target;

    if(ele && ele.checked){
      this.incidentFormGroup.controls['reporterId'].setValue(null);
    }else{

    }
  }
  private resetForm(){
    this.incidentFormGroup.reset();
    this.incidentFormGroup.controls['createNewReporter'].setValue(false);
    this.incidentFormGroup.controls['priority'].setValue('');
    this.incidentFormGroup.controls['status'].setValue('');
  }
  onChangeReporter($event:any){
    const ele = $event.target;
    if(!ele) return;
    const value = ele.value.trim();
    if(value && value.length > 2){
      this.commonService.fetchReporters(value)?.subscribe({
        next : (response:any)=>{
          this.reporters = response;
        },error : (err:any)=>{
          
        }
      })
    }
  }
}
