import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private httpClient : HttpClient) { }

  getCityAndState(pincode: string): Observable<{ city: string, state: string }> {
    return this.httpClient.get<{ Message: string, Status: string, PostOffice: any[] }>(`/api/pincode/${pincode}`)
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
  
}