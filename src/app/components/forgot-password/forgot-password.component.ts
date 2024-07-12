import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit{
  showNewPassword : boolean = true;
  forgotPasswordFormGroup!:FormGroup;

  constructor(private fb : FormBuilder,private commonService : CommonService,private router : Router){}

  ngOnInit(): void {
      this.forgotPasswordFormGroup = this.fb.group({
        emailAddress : [,Validators.required],
        newPassword : [,Validators.required]
      })
  }
  matchPasswordFlag : boolean = true;

  matchPassword($event:any){
    const ele = $event.target;
    if(ele && ele.value){
      if(ele.value !== this.forgotPasswordFormGroup.controls['newPassword'].value)  this.matchPasswordFlag = false;
      else this.matchPasswordFlag =  true;
    }else this.matchPasswordFlag = false;
  }
  onForgotPassword(){
    if(this.forgotPasswordFormGroup.invalid && this.matchPasswordFlag === false){
      alert("Fill the details!!!!");
      return;
    }
    this.commonService.forgotPassword(this.forgotPasswordFormGroup.value).subscribe({
      next : (response:any)=>{
        alert("reset successfully");
        this.router.navigate(['']);
      },error : (err:any)=>{
        alert("something bad happened!! or invalid credentials");
      }
    })
  }
}
