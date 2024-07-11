import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

const host = "http://localhost:3000/api/v1"
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private httpClient : HttpClient) { }

  getCityAndState(pincode: string): Observable<{ city: string, state: string }> {
    return this.httpClient.get<any>(`${host}/pincode/${pincode}`)
      .pipe(
        map(response => {
          if (response.Status === "Success" && response.PostOffice.length > 0) {
            return {
              city: response.PostOffice[0].District,
              state: response.PostOffice[0].State,
              country : response.PostOffice[0].Country
            };
          } else {
            throw new Error('Invalid pincode or no data available');
          }
        })
      );
  }
  
  registerUser(payload : any){
    return this.httpClient.post(`${host}/user/register`,payload);
  }

  login(payload : any){
    return this.httpClient.post(`${host}/user/login`,payload);
  } 
  
  createIncident(payload : any){
    return this.httpClient.post(`${host}/incident/create`,payload);
  }

}