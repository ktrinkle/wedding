import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from './../environments/environment';
import { frontLogin, bearerDto } from '../app/data/data';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private REST_API_SERVER = environment.api_url;

  constructor(private httpClient: HttpClient) { }

  // login stuff
  public sendEmailLogin(userLogin: frontLogin): Observable<bearerDto> {
    var uri = this.REST_API_SERVER + '/Login/login';
    return this.httpClient.post<bearerDto>(uri, userLogin);
  }
}
