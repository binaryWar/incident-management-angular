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
  reporters: { id: number, name: string }[] = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Mike Johnson' }
    // Replace with actual reporter data fetched from database
  ];
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
        console.log(JSON.stringify(data));
        this.closeModal();
        this.fetchIncidents();
      },error : (error:any)=>{
        alert("Something bad happend!!!");
      }
    });
  }

  editIncident(incident: any) {
    this.openModal();
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
}
