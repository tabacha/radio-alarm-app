
export interface IWakeupTime {
    name: string;
    time: string;
    active: boolean;
    once: boolean;
    free: boolean;
    not_free: boolean;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
}

export function isWakeUpTimeEqual(time1:IWakeupTime, time2:IWakeupTime):boolean {
    const time1Keys=(Object.keys(time1) as (keyof IWakeupTime)[])
    const time2Keys=(Object.keys(time2) as (keyof IWakeupTime)[])
    const keys= new Set(time1Keys.concat(time2Keys))
    let rtn=true
    keys.forEach(key =>{
        if ((time1Keys.indexOf(key)>-1) && (time2Keys.indexOf(key)>-1)) {
            if (time1[key]!=time2[key]) {
                rtn=false
            }
        } else {
            if (time1Keys.indexOf(key)>-1) {
                if (time1[key]==true) {
                    rtn=false
                }
            } else {
                if (time2[key]==true) {
                    rtn=false
                }
            }
        }
    })
    console.log('equal',time1,time2,rtn)
    return rtn
  }
