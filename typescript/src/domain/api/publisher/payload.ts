module KCW.API {
    export interface Payload {
        timestamp: number;// time payload sent
        event: PayloadEvent;
    }
    export interface PayloadEvent {
        target: string;
        type: string;
        finish: number;
        params: PayloadEventParams;
    }
    export interface PayloadEventParams {
        format: string;
        key: number;
        label: string;
        unit: string;
        optional?: any;
    }

}