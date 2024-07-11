import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { CommonService } from './common.service';

@Injectable()
export class HttpInterceptorInterceptor implements HttpInterceptor {

  constructor(private commonService : CommonService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let loggedInUserId = this.commonService.getLoggedInUserId();

    if (!loggedInUserId) {
      const items = sessionStorage.getItem("credentials");
      if (items) {
        loggedInUserId = JSON.parse(items).id;
      }
    }

    if (loggedInUserId) {
      const modifiedReq = request.clone({
        setHeaders: {
          'userId' : `${loggedInUserId}`
        },
      });
      return next.handle(modifiedReq);
    }
    else return next.handle(request);
  }
}
