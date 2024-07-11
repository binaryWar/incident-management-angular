import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  activeBtn : string = "signupBtn";
  showPassword : boolean = true;
  onSignUpClick(event:any){ 
    this.activeBtn = "signupBtn";
  }
  onLoginClick(event:any){
    this.activeBtn = "loginBtn";
  }
}
