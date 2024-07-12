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
  showReporterMobileNoInput : boolean = false;
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
      createNewReporter : [false],
      reporterMobileNo : [null]
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
    this.resetForm();
  }

  saveIncident() {
    this.addValidatorForForm();

    if(this.incidentFormGroup.invalid){
      alert("Please fill all the details");
      return;
    }
    const payloadBody = this.constructPayload();
    this.commonService.createIncident(payloadBody).subscribe({
      next : (data:any)=>{
        this.closeModal();
        this.fetchIncidents();
        this.resetForm();
      },error : (error:any)=>{
        alert("Something bad happend!!!");
      }
    });
  }

  private constructPayload(){
    const formValue = this.incidentFormGroup.value;
    
    const requestBody = { ...formValue };

    if (requestBody.reporterId) {
      delete requestBody.reporterName;
      delete requestBody.reporterMobileNo;
    }

    return requestBody;
  }

  editIncident(incident: any) {
    this.openModal();
    this.ActivatedIncidentNumber = incident.incidentNumber;
    this.pathFormValue(incident);
  }

  onEditButtonClick(){
    this.addValidatorForForm();
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

  onReporterOptionClick(reporter:{id:number,name:string}){
    if(!reporter) return;
    this.incidentFormGroup.controls['reporterName'].setValue(reporter.name);
    this.incidentFormGroup.controls['reporterId'].setValue(reporter.id);
    this.incidentFormGroup.controls['createNewReporter'].setValue(false);
  }
  
  onCreateReporterChange(event:any){
    const ele = event.target;

    if(ele && ele.checked){
      this.incidentFormGroup.controls['reporterId'].setValue(null);
      this.showReporterMobileNoInput = true;
      this.incidentFormGroup.controls['reporterMobileNo'].addValidators([Validators.required]);

    }else{
      this.showReporterMobileNoInput = false;
      this.incidentFormGroup.controls['reporterMobileNo'].clearValidators();
    }
    this.incidentFormGroup.controls['reporterMobileNo'].updateValueAndValidity();
  }

  private resetForm(){
    this.incidentFormGroup.reset();
    this.incidentFormGroup.controls['createNewReporter'].setValue(false);
    this.incidentFormGroup.controls['priority'].setValue('');
    this.incidentFormGroup.controls['status'].setValue('');
    this.incidentFormGroup.controls['reporterMobileNo'].clearValidators();
    this.incidentFormGroup.controls['reporterMobileNo'].updateValueAndValidity();
    this.showReporterMobileNoInput = false;
    this.ActivatedIncidentNumber = null;
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
  private addValidatorForForm(){
    const {reportedId,createNewReporter} = this.incidentFormGroup.value;
    if(!reportedId){
      this.showReporterMobileNoInput = true;
      this.incidentFormGroup.controls['createNewReporter'].setValue(true);
      this.incidentFormGroup.controls['reporterMobileNo'].addValidators([Validators.required]);
      this.incidentFormGroup.controls['reporterMobileNo'].updateValueAndValidity();
    }
  }
}
