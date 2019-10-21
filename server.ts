import { ODataServer, ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { ProductsController } from "./routes/ProductsController";
import { UsersController } from "./routes/UsersControllers"
import { CategoriesController } from "./routes/CategoriesController"
@odata.cors
@odata.namespace("Ecom")
@odata.controller(ProductsController, true)
@odata.controller(UsersController, true)
@odata.controller(CategoriesController, true)
export class EcomServer extends ODataServer {
}