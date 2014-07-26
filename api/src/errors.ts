var debug = (marker, value) => {
    console.log("[kcw]", marker, value);
};
module API {
    export var INTERNAL: number = 500;
    export var BAD_REQUEST: number = 400;
    export var ACCESS_DENIED: number = 403;
    export var ENDPOINT_NOT_FOUND: number = 404;
    export var ALREADY_SUBSCRIBED: number = 409;
    export class Err {
        public message: string;
        private static messages = {
            "403": "Access denied by user",
            "404": "Endpoint not found",
            "409": "Already registered subscriber",
            "500": "Chrome Extension Internal Error"
        };
        private static getMessage(code: number): string {
            return Err.messages[String(code)] || "Unknown error";
        }
        public static Of(code: number): Err {
            return new this(code);
        }
        constructor(public code: number) {
            this.message = Err.getMessage(code);
        }
    }
}
