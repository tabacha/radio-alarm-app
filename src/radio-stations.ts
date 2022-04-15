export interface IRadioStations {
    [stationName: string] : {
        serviceId: number,
        componentId: number,
        freqencyIndex: number,
    }
}