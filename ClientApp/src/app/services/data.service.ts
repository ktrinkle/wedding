import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { frontLogin, bearerDto, weddingPartyDto, weddingPartyMemberDto, weddingPartyGiftDto, photoListDto } from '../data/data';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Guid } from 'typescript-guid';
import { Binary } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public REST_API_SERVER = environment.api_url;

  constructor(private httpClient: HttpClient) { }

  public bootStatus: boolean = false;

  // login stuff
  public sendEmailLogin(userLogin: frontLogin): Observable<bearerDto> {
    var uri = this.REST_API_SERVER + '/Login/login';
    return this.httpClient.post<bearerDto>(uri, userLogin);
  }

  public getPartyByAuth(): Observable<weddingPartyDto> {
    var uri = this.REST_API_SERVER + '/Login/partyByAuth';
    return this.httpClient.get<weddingPartyDto>(uri);
  }

  public getParty(partyGuid: string): Observable<weddingPartyDto> {
    var uri = this.REST_API_SERVER + '/Login/party/' + encodeURIComponent(partyGuid) + '';
    return this.httpClient.get<weddingPartyDto>(uri);
  }

  public getPartyByEmail(emailAddr: string): Observable<weddingPartyDto> {
    var uri = this.REST_API_SERVER + '/Login/party/' + encodeURIComponent(emailAddr) + '';
    return this.httpClient.get<weddingPartyDto>(uri);
  }

  public getPartyMembers() : Observable<weddingPartyMemberDto[]> {
    var uri = this.REST_API_SERVER + '/Rsvp/getMembers';
    return this.httpClient.get<weddingPartyMemberDto[]>(uri);
  }

  public saveRsvp(party: weddingPartyMemberDto): Observable<weddingPartyMemberDto[]> {
    var uri = this.REST_API_SERVER + '/Rsvp/saveRsvp';
    return this.httpClient.post<weddingPartyMemberDto[]>(uri, party);
  }

  public deleteMember(party: weddingPartyMemberDto): Observable<weddingPartyMemberDto[]> {
    var uri = this.REST_API_SERVER + '/Rsvp/removeMember';
    return this.httpClient.post<weddingPartyMemberDto[]>(uri, party);
  }

  public getAdminRsvpList(): Observable<any> {
    var uri = this.REST_API_SERVER + '/Admin/currentRsvp';
    return this.httpClient.get(uri);
  }

  public saveAdminRsvpList(party: weddingPartyMemberDto): Observable<weddingPartyMemberDto[]> {
    var uri = this.REST_API_SERVER + '/Admin/saveRsvp';
    return this.httpClient.post<weddingPartyMemberDto[]>(uri, party);
  }

  public getAdminGiftList(): Observable<weddingPartyGiftDto[]> {
    var uri = this.REST_API_SERVER + '/Admin/currentGifts';
    return this.httpClient.get<weddingPartyGiftDto[]>(uri);
  }

  public saveAdminGift(partyGift: weddingPartyGiftDto): Observable<any> {
    var uri = this.REST_API_SERVER + '/Admin/saveGift';
    return this.httpClient.post<weddingPartyGiftDto[]>(uri, partyGift);
  }

  public savePhotoFile(fileForm: FormData): Observable<HttpEvent<string>> {
    var uri = this.REST_API_SERVER + '/Photo/uploadPhotoFile';
    return this.httpClient.post<string>(uri, fileForm, {observe: 'events', reportProgress: true});
  }

  public getThumbnails(): Observable<photoListDto[]> {
    var uri = this.REST_API_SERVER + '/Photo/getThumbnails';
    return this.httpClient.get<photoListDto[]>(uri);
  }

  public getPhoto(photoGuid: Guid, photoType: string): any {
    var uri = this.REST_API_SERVER + '/Photo/full/' + encodeURIComponent(photoType) + '/' + encodeURIComponent(photoGuid.toString()) + '';
    return this.httpClient.get(uri);
  }

  public getSasKey(): Observable<string> {
    var uri = this.REST_API_SERVER + '/Photo/fulltoken';
    return this.httpClient.get<string>(uri);
  }

}
