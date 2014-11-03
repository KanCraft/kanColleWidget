
module KCW.API {
    export class NotFoundController extends Controller {
        perform(): NotFoundController {
            return this.ng({
                status: 404,
                message: "Route not found for path: " + this.request.path
            });
        }
    }
}