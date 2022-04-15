import { Injectable } from '@angular/core';
import { Observable, ObservableInput } from "rxjs";
import { IWakeupTime } from 'src/wackup-time';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'X-Radio-Frontend-Version': environment.VERSION,
    'X-Radio-Frontend-Production': String(environment.production),
  })
};

@Injectable({
  providedIn: 'root'
})
export class WackupTimeService {
  baseUrl="/api/wakeup/"
  items: IWakeupTime[] = [];

  constructor(
    private http: HttpClient
  ){
  }

  getWakeupTimes(): IWakeupTime[] {
    return this.items;
  }
  addWakeupTime(wtime: IWakeupTime) {
    this.items.push(wtime)
  }
  load(id:number) {
    return this.http.get<IWakeupTime>(this.baseUrl +id, httpOptions)
  }
  create(data:IWakeupTime){
    return this.http.post<any>(this.baseUrl + '-1', data, httpOptions)
  }
  update(id:number, data:IWakeupTime){
    return this.http.post<any>(this.baseUrl + id, data, httpOptions)
  }
  /*save(value:any):ObservableInput<any> {
    return
  }*/
}
