import { Injectable } from '@angular/core';
import { frontLogin, simpleUser } from '../data/data';
import { DataService } from './data.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject : BehaviorSubject<simpleUser>;
  private currentUser : Observable<simpleUser>;
  private currentTokenSubject: BehaviorSubject<string>;
  private currentToken: Observable<string>;

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private dataService:DataService, private router: Router)
  {
    this.currentUserSubject = new BehaviorSubject<simpleUser>({
      partyAddress: localStorage.getItem('partyAddress') ?? undefined,
      partyGuid: localStorage.getItem('partyGuid') ?? undefined
    });

    this.currentUser = this.currentUserSubject.asObservable();

    this.currentTokenSubject = new BehaviorSubject<any>(sessionStorage.getItem('access_token'));
    this.currentToken = this.currentTokenSubject.asObservable();

    if(localStorage.getItem('access_token') != null)
    {
      this.loggedIn.next(true);
    }
  }

  public get currentUserValue(): simpleUser{
    return this.currentUserSubject.value;
  }

  public getAccessToken(): Observable<string> {
    return this.currentToken;
  }

  public processLoginEmail(loginDto: frontLogin): void
  {
    if (loginDto.emailAddress != '' && loginDto.password != '')
    {
      this.dataService.sendEmailLogin(loginDto).subscribe(al =>
        {
          localStorage.setItem('access_token', al.bearerToken ?? "");
          localStorage.setItem('partyAddress', al.partyAddress ?? "");
          localStorage.setItem('partyGuid', al.partyGuid ?? "");

          if (al.bearerToken)
          {
            this.loggedIn.next(true);
            this.router.navigate(["wedding"]);
          }
        })

    }
  }

  public isLoggedIn(){
    return this.loggedIn.asObservable();
  }

}
