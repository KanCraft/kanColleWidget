/// <reference path="../errors.ts" />
/// <reference path="./controller.ts" />

module API {
    export class NotFoundController extends Controller {
        execute() {
            return this.reject(Err.Of(ENDPOINT_NOT_FOUND));
        }
    }
}
