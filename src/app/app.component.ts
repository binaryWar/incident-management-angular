import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'incident-management';
  showLoginButton : boolean = false;
  constructor(private authSer : AuthService,private activatedRoute : ActivatedRoute){}
  ngOnInit(): void {
    this.changeRouteChange();
  }
  
  logout(){
    this.authSer.logout();
  }
  private changeRouteChange(){
    this.activatedRoute.url.subscribe(url =>{
      console.log(url);
    });
  }
}
