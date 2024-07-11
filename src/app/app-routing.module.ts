import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { IncidentComponent } from './components/incident/incident.component';

const routes: Routes = [
  {path : "", component : LoginComponent , pathMatch : 'full'},
  {path : "incident", component : IncidentComponent, pathMatch : 'full'},
  {path : '*',component : LoginComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
