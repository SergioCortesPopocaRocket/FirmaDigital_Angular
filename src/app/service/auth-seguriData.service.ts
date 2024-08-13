import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { AppConfig } from '../config/app-config';
import { from, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

export class AuthSeguriData {
  private apiSD = AppConfig.apiSeguriDataSign;
  private apiGetHashPDF = AppConfig.apiSeguriDataMultilateral;
  private apiGetHashFab = AppConfig.apiSeguriDataMultilateralGetHash
  private apiSignWithHash = AppConfig.apiSeguriDataSignWiHash;
  private apiUpdate = AppConfig.apiSeguriDataMultilateralUpdate;
  private apiFinalize = AppConfig.apiSeguriDataFinalize;
  private apiGetStatus = AppConfig.apiSeguriDataGetStatus;
  private apiWriteSignature = AppConfig.apiSeguriDataWriteSignature;

  constructor(private http: HttpClient,private cookieService: CookieService) {

   }

  getSessionToken(formData: string):Observable<any>{
    let params = new URLSearchParams(formData)
    let param = JSON.parse(params.get('params') || '{}')

    const headers = new HttpHeaders({
       'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });

    return this.http.post(this.apiSD.concat('password=',param.password,'&user=',param.user), { headers });
  }

  apiSeguriDataMultilateral(formData: string):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
     'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${this.cookieService.get('bearer')}`
   });

   return this.http.post(this.apiGetHashPDF,formData, { headers });
  }

  apiSeguriDataMultilateralGetHash(formData: string):Observable<any>{
    let idLateral = JSON.parse(this.cookieService.get('startMultilateral'))
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
     'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${this.cookieService.get('bearer')}`
   });
   return this.http.post(this.apiGetHashFab.concat(idLateral.multilateralId),formData, { headers });
  }

  //Get PKCS7
  signWithHash(formData: string): Observable<any>{
    let idLateral = JSON.parse(this.cookieService.get('startMultilateral'))
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
     'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Methods': 'GET , PUT , POST , DELETE',
     'Access-Control-Allow-Headers': 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method',
        'Authorization': `Bearer ${this.cookieService.get('bearer')}`
   });
   return this.http.post(this.apiSignWithHash,formData, { headers });
  }

  //Insert biometric data only
  apiSeguriDataMultilateralUpdate(formData: string): Observable<any>{
    let idLateral = JSON.parse(this.cookieService.get('startMultilateral'))
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
     'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${this.cookieService.get('bearer')}`
   });
   return this.http.post(this.apiUpdate.concat(idLateral.multilateralId),formData, { headers });
  }

  //Insert simple digital sign
  writeSimpleSign(formData: string): Observable<any>{
    let idLateral = JSON.parse(this.cookieService.get('startMultilateral'))
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
     'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${this.cookieService.get('bearer')}`
   });
   return this.http.post(this.apiWriteSignature.concat(idLateral.multilateralId),formData, { headers });
  }

  finalizeSign(formData: string): Observable<any>{
    let idLateral = JSON.parse(this.cookieService.get('startMultilateral'))
    console.log(formData)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
     'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${this.cookieService.get('bearer')}`
   });
   return this.http.get(this.apiFinalize.concat(idLateral.multilateralId,'/',formData),{headers});
  }

  getDocumentStatus():Observable<any>{
    let idLateral = JSON.parse(this.cookieService.get('startMultilateral'))
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
     'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${this.cookieService.get('bearer')}`
   });
   return this.http.get(this.apiGetStatus.concat(idLateral.multilateralId), { headers });
  }

  }

