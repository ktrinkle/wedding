import { Injectable } from '@angular/core';
import { frontLogin, simpleUser } from '../data/data';
import { DataService } from './data.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { partyByAuth } from '../store/wedding.actions';
import { EventService } from '../services/event.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private dataService:DataService, private router: Router, private store: Store,
    public eventService: EventService) { }

    public isLoggedIn():boolean {
      const token = localStorage.getItem('access_token'); // get token from local storage

      if (token)
      {
        //const payload = Buffer.from(token.split('.')[1], 'base64');
        const payload = window.atob(token.split('.')[1]); // decode payload of token

        const parsedPayload = JSON.parse(payload.toString()); // convert payload into an Object

        return parsedPayload.role != "photoUpload" && parsedPayload.exp > Date.now() / 1000; // check if token is expired
      }

      // if the token is null, always return false since the user isn't logged in.
      return false;
    }

    public getSasToken():string{
      const token = localStorage.getItem('sasToken');

      if (token)
      {
        return token;
      }

      return "";
    }

    public isAdmin():boolean {
      const token = localStorage.getItem('access_token'); // get token from local storage

      if (token)
      {
        const payload = window.atob(token.split('.')[1]); // decode payload of token

        const parsedPayload = JSON.parse(payload.toString()); // convert payload into an Object

        return parsedPayload.role.includes("Admin") && parsedPayload.exp > Date.now() / 1000; // check if token has role and is admin
      }

      // if the token is null, always return false since the user isn't logged in.
      return false;
    }

    public isPhotoUpload():boolean {
      const token = localStorage.getItem('access_token'); // get token from local storage

      if (token)
      {
        const payload = window.atob(token.split('.')[1]); // decode payload of token

        const parsedPayload = JSON.parse(payload.toString()); // convert payload into an Object

        return parsedPayload.role == "photoUpload" && parsedPayload.exp > Date.now() / 1000; // check if token has role and is admin
      }

      return false;
    }

  public processLoginEmail(loginDto: frontLogin): number
  {
    if (loginDto.emailAddress != '' && loginDto.password != '')
    {
      var returnVal = 0;
      this.eventService.loginStartEmit();
      this.dataService.sendEmailLogin(loginDto).subscribe({
        next: (al: any) => {
          if (al.bearerToken)
          {
            localStorage.setItem('access_token', al.bearerToken ?? "");
            localStorage.setItem('partyAddress', al.partyAddress ?? "");
            localStorage.setItem('partyGuid', al.partyGuid ?? "");
            localStorage.setItem('sasToken', al.sasToken ?? "");
            this.isLoggedIn();
            this.store.dispatch(partyByAuth());
            this.eventService.loginEndEmit();
            returnVal = -1;
          }
          else
          {
            returnVal = 0;
          }
        },
        error: () => {
          this.eventService.loginFailEmit();
          returnVal = 1;
        },
        complete: () => {
          this.eventService.loginEndEmit();
          return returnVal;
        }
      });
    }
    return 1;
  }

  public processLogout(): void
  {
    localStorage.removeItem('access_token');
    localStorage.removeItem('partyAddress');
    localStorage.removeItem('partyGuid');
    localStorage.removeItem('sasToken');

    this.router.navigate(['']);
  }

}

