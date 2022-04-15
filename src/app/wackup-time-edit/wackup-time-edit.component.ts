import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { WackupTimeService } from '../wackup-time.service';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl } from '@angular/forms';
import { ValidationErrors } from '@angular/forms';
import { debounceTime, Subject, switchMap, takeUntil,filter,tap } from 'rxjs';
import { IWakeupTime } from 'src/wackup-time';
import { isWakeUpTimeEqual } from 'src/wackup-time';


enum FormStatus {
  Saving = 'Speichere..',
  Saved = 'Gespeichert !',
  Idle = '',
}

function sleep(ms: number): Promise<any> {
  return new Promise((res) => setTimeout(res, ms));
}

@Component({
  selector: 'app-wackup-time-edit',
  templateUrl: './wackup-time-edit.component.html',
  styleUrls: ['./wackup-time-edit.component.less']
})
export class WackupTimeEditComponent implements OnInit {
  id = -1;
  formStatus: FormStatus = FormStatus.Idle;
  wackupTimeForm = this.formBuilder.group({
    name: '',
    time: ['', [Validators.pattern(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/), Validators.required]],
    active: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    once: false,
    free: false,
    not_free: false
  }, { validators: [WackupTimeEditComponent.wtValidator, WackupTimeEditComponent.freeNonFreeValidator] });

  static non_once_fields = {
  'monday':  'Montag',
  'tuesday':  'Dienstag',
  'wednesday': 'Mittwoch',
  'thursday':'Donnerstag',
  'friday': 'Feitag',
  'saturday': 'Samstag',
  'sunday': 'Sonntag',
  'free': 'Zusätzlich auch an freien Tagen',
    'not_free': 'Nicht an freien Tagen'
  }
  // FIXME toLocaleString


  constructor(
    private service: WackupTimeService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,

  ) {  }

  lastSavedValue:IWakeupTime|null=null

  private unsubscribe = new Subject<void>()
  ngOnDestroy() {
    this.unsubscribe.next()
  }
  ngOnInit(): void {
    this.wackupTimeForm.get('once')?.valueChanges
      .subscribe(value => {
        Object.keys(WackupTimeEditComponent.non_once_fields).forEach( fieldname => {
          if (value) {
            this.wackupTimeForm.get(fieldname)?.disable()
          } else {
            this.wackupTimeForm.get(fieldname)?.enable()
          }
        })
      })
      this.wackupTimeForm.get('active')?.valueChanges
      .subscribe(value => {
        if (value) {
          this.wackupTimeForm.markAllAsTouched()
          this.wackupTimeForm.updateValueAndValidity()
        }
      })
      this.route.params.subscribe(param => {
        console.log(param)
        if (param['id'] !== '-1') {
          this.id=param['id']
          this.service.load(param['id']).subscribe({
            next: (response) => {
              this.lastSavedValue=response
              this.wackupTimeForm.setValue(response)
            },
            error: (error) => console.log(error),
          });
        }
      });
/*      this.wackupTimeForm.get('not_free')?.valueChanges
      .subscribe(value => {
        if (value) {
          this.wackupTimeForm.get('free')?.disable()
        } else {
          this.wackupTimeForm.get('free')?.enable()
        }
      })
      this.wackupTimeForm.get('free')?.valueChanges
      .subscribe(value => {
        if (value) {
          this.wackupTimeForm.get('not_free')?.disable()
        } else {
          this.wackupTimeForm.get('not_free')?.enable()
        }
      })*/
      this.wackupTimeForm.valueChanges.pipe(
        filter(()=>{
          return(this.wackupTimeForm.valid)
        }),
        filter(newVal=>{
          if (this.lastSavedValue==null) {
            return(true)
          }
          return(isWakeUpTimeEqual(this.lastSavedValue, newVal)==false)
        }),
        debounceTime(500),
        tap(() => {
          this.formStatus = FormStatus.Saving;
        }),
        switchMap(formValue =>
          this.service.update(this.id, formValue)),

        takeUntil(this.unsubscribe)
    ).subscribe(async () => {
      this.lastSavedValue=this.wackupTimeForm.value
      this.formStatus = FormStatus.Saved;
      await sleep(3000);
      if (this.formStatus === FormStatus.Saved) {
        this.formStatus = FormStatus.Idle;
      }
    })
  }

  checkValidateError(fieldname: string, errorType: string) {
    const field = this.wackupTimeForm.get(fieldname)
    return (field?.hasError(errorType) && (field?.dirty || field?.touched))
  }


  nonOnceEntries() :[string,string][] {
    return Object.entries(WackupTimeEditComponent.non_once_fields)
  }


  static wtValidator(g: AbstractControl): ValidationErrors | null  {
    let hasOneActiveDay = true
    if (g) {
      if (g.get('active')?.value == true) {
        hasOneActiveDay = false
        if (g.get('once')?.value == true) {
          hasOneActiveDay = true
        } else {
          Object.entries(WackupTimeEditComponent.non_once_fields).forEach(entry => {
            if (g.get(entry[0])?.value) {
              hasOneActiveDay = true
            }
          })
        }
      }
      if (hasOneActiveDay) {
        g.get('active')?.setErrors( null )
        return null;
      } else {
        g.get('active')?.setErrors({ 'noActiveDays': true })
        return { 'noActiveDays': true };
      }
    }
    return null;
  }
  static freeNonFreeValidator(g: AbstractControl): ValidationErrors | null  {
    if (g) {
      if ((g.get('free')?.value == true) && (g.get('not_free')?.value == true)) {
        console.log('err')
        g.get('free')?.setErrors({'free_not_free_true':true})
        g.get('not_free')?.setErrors({'free_not_free_true':true})
        return {'free_not_free_true':true}
      }
      if (g.get('free')?.hasError('free_not_free_true')) {
        g.get('free')?.setErrors(null)
      }

      g.get('not_free')?.setErrors(null)
    }
    return null;
  }

  isSaving():boolean {
    return (this.formStatus==FormStatus.Saving)
  }
}
