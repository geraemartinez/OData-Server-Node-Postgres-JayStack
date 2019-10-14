import { ODataServer, ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { ProductsController } from "./routes/ProductsController";
import { UsersController } from "./routes/UsersControllers"

@odata.namespace("Ecom")
@odata.controller(ProductsController, true)
@odata.controller(UsersController, true)
export class EcomServer extends ODataServer {
}