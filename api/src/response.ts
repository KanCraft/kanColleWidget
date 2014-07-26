module API {
    export interface IRequestMessage {
        path: string;
        params?: any;
        controller?: any;
    }
    export class Response {
        constructor(public message: string = "") {}
    }
}
