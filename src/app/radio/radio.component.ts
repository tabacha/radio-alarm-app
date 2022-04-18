import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RadioStatusService } from '../radio-status.service';


@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.less']
})
export class RadioComponent implements OnInit {
  form = this.formBuilder.group({
    'station': "NDR 2 HH",
    'volume': 20,
    'on': false,
  })
  stations:string[]= [
  ]
  constructor(
    private formBuilder: FormBuilder,
    private service: RadioStatusService,
  ) { }
  searching=false
  ngOnInit(): void {
    this.service.get_sender_list().subscribe(senderData=>{
      this.stations=senderData
      this.service.get_status().subscribe(status=>{
        this.form.get('station')?.setValue(status.station,{emitEvent:false})
        this.form.get('on')?.setValue(status.on,{emitEvent:false})
      })
    })
    this.form.get('station')?.valueChanges.subscribe(newStation=>{
      console.log(newStation)
      let on=this.form.get('on')?.value
      this.service.set_status(newStation,on).subscribe(()=>{})
    })
    this.form.get('on')?.valueChanges.subscribe(on=>{
      let newStation=this.form.get('station')?.value
      this.service.set_status(newStation,on).subscribe(()=>{})
    })
    this.form.get('volume')?.valueChanges.subscribe(vol=>{
      console.log(vol)
      this.service.set_volume(vol).subscribe(()=>{})
    })
    this.service.get_volume().subscribe(vol=>{
      this.form.setValue(vol,{emitEvent:false})
    })
  }
  stationSearch() {
    this.searching=true
    this.service.sender_search().subscribe(senderData=>{
      this.stations=senderData
      this.searching=false
      if ('NDR 2 HH' in senderData) {
        this.form.get('station')?.setValue('NDR 2 HH')
        console.log('xx1x NDR')
      } else {
        this.form.get('station')?.setValue(this.stations[6])
      }
    })
  }
  isSearching(): boolean {
    return this.searching
  }
}
