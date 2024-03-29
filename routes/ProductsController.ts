  
import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { createQuery } from "odata-v4-pg";
//import DatabaseClient.convertResult  from "./../utils/DatabaseClient.convertResult";
import { Product } from "../models/Product";
import DatabaseClient from "../utils/DatabaseClient"

@odata.type(Product)
export class ProductsController extends ODataController {

  @odata.GET
  async select( @odata.query query: ODataQuery): Promise<Product[]> {
    const db = await DatabaseClient.connect();
    const sqlQuery = createQuery(query);
    const {rows} = await db.query(sqlQuery.from('"Product"'), sqlQuery.parameters);
    return DatabaseClient.convertResult(rows);
  }

  @odata.GET
  async selectOne( @odata.key key: number, @odata.query query: ODataQuery): Promise<Product> {
    const db = await DatabaseClient.connect();
    const sqlQuery = createQuery(query);
    const {rows} = await db.query(`SELECT ${sqlQuery.select} FROM "Product"
                                   WHERE "Id" = $${sqlQuery.parameters.length + 1} AND
                                         (${sqlQuery.where})`,[...sqlQuery.parameters, key]);
    return DatabaseClient.convertResult(rows)[0];
  }

  @odata.POST
  async insert( @odata.body data: any): Promise<Product> {
    const db = await DatabaseClient.connect();
    const {rows} = await DatabaseClient.insert(db, "Product", [data]);
    return DatabaseClient.convertResult(rows)[0];
  }

  @odata.PUT
  async upsert( @odata.key key: number, @odata.body data: any, @odata.context context: any): Promise<Product> {
    const db = await DatabaseClient.connect();
    const {rows} = await DatabaseClient.replace(db, "Product", key, data);
    return DatabaseClient.convertResult(rows)[0];
  }

  @odata.PATCH
  async update( @odata.key key: number, @odata.body delta: any): Promise<number> {
    const db = await DatabaseClient.connect();
    const {rows} = await DatabaseClient.update(db, "Product", key, delta);
    return DatabaseClient.convertResult(rows)[0];
  }

  @odata.DELETE
  async remove( @odata.key key: number): Promise<number> {
    const db = await DatabaseClient.connect();
    const {rowCount} = await db.query(`DELETE FROM "Product" WHERE "Id" = $1`, [key]);
    return rowCount;
  }


  @Edm.Function
  @Edm.Collection(Edm.EntityType(Product))
  async getInPriceRange( @Edm.Decimal min: number, @Edm.Decimal max: number): Promise<Product[]> {
    const db = await DatabaseClient.connect();
    const {rows} = await db.query(`SELECT * FROM "Product" WHERE "UnitPrice" >= $1 AND "UnitPrice" <= $2`, [min, max]);
    return DatabaseClient.convertResult(rows);
  }
}