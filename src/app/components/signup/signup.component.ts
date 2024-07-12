import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  userRegistrationForm!:FormGroup;
  
  constructor(private formBuilder : FormBuilder,private commonService : CommonService){
    this.createForm();
  }

  private createForm(): void {
    
    this.userRegistrationForm = this.formBuilder.group({
      userType: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.maxLength(15)]],
      lastName: ['', [Validators.required, Validators.maxLength(15)]],
      emailAddress: ['', [Validators.required, Validators.email]],
      address: [null, [Validators.required, Validators.maxLength(50)]],
      country: ['', [Validators.required, Validators.maxLength(15)]],
      state: ['', [Validators.required, Validators.maxLength(15)]],
      pincode: [null, [Validators.required, Validators.maxLength(10)]],
      city: ['', [Validators.required, Validators.maxLength(15)]],
      countryCode: [null, [Validators.required, Validators.maxLength(6)]],
      mobileNo: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^\\d+$")]],
      fax: [null, Validators.maxLength(15)],
      phone: [null, Validators.maxLength(15)],
      password: [null, [Validators.required, Validators.maxLength(15), Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator // Custom validator for password confirmation
    });
  }
  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
  
    if (!password || !confirmPassword || password.value === confirmPassword.value) {
      return null;
    }
  
    return { 'passwordMismatch': true };
  }

  get f() { return this.userRegistrationForm.controls; }

  onSubmit(){
    if(this.userRegistrationForm.invalid){
      alert("Fill all mandatory fields to contine");
      return;
    }
    const payloadBody = this.userRegistrationForm.value;
    this.commonService.registerUser(payloadBody).subscribe({
      next : (response : any)=>{
        alert("Creation success");
      },error : (err:any)=>{
        alert("some thing went wrong");
      }
    })
  }
  populateCity_State($event:any){    
    let pincode;
    let value = `${$event}`;
    console.log(typeof(value))
    if($event && value.length === 6){
      pincode = $event;
    }else return;
    this.commonService.getCityAndState(pincode).subscribe((data:any)=>{
      const {city,state,country} = data;
      this.userRegistrationForm.controls['city'].setValue(city);
      this.userRegistrationForm.controls['state'].setValue(state);
      this.userRegistrationForm.controls['country'].setValue(country);
    })
  }
}
