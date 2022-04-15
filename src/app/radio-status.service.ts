import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { IRadioStations } from 'src/radio-stations';
import { IRadioStatus } from 'src/radio-status';
import { IAudioVolume } from 'src/audio-volume';

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
export class RadioStatusService {
  baseUrl="/api/"

  constructor(
    private http: HttpClient
  ) { }

  get_sender_list() {
    return this.http.get<IRadioStations>(this.baseUrl + 'dab/stations/', httpOptions)
  }
  sender_search() {
    return this.http.post<IRadioStations>(this.baseUrl + 'dab/stations/','', httpOptions)
  }
  get_status() {
    return this.http.get<IRadioStatus>(this.baseUrl + 'dab/', httpOptions)
  }
  get_volume() {
    return this.http.get<IAudioVolume>(this.baseUrl + 'audio/volume/', httpOptions)
  }
  set_volume(vol:number) {
    let data:IAudioVolume={
      volume:vol
    }
    return this.http.post<IAudioVolume>(this.baseUrl+'audio/volume/', data,httpOptions)
  }
  set_status(station:string, on:boolean) {
    let data:IRadioStatus={
      'station':station,
      'on':on
    }
    return this.http.post<IRadioStatus>(this.baseUrl+'/dab/', data,httpOptions)
  }
}
