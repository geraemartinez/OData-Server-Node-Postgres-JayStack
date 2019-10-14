  
import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { createQuery } from "odata-v4-pg";
import convertResults  from "./../utils/convertResults";
import { Product } from "../models/Product";
import connect from "./../utils/connect";
import insert from "./../utils/insert";
import replace from "./../utils/replace";
import update from "./../utils/update";

@odata.type(Product)
export class ProductsController extends ODataController {

  @odata.GET
  async select( @odata.query query: ODataQuery): Promise<Product[]> {
    const db = await connect();
    const sqlQuery = createQuery(query);
    const {rows} = await db.query(sqlQuery.from('"Products"'), sqlQuery.parameters);
    return convertResults(rows);
  }

  @odata.GET
  async selectOne( @odata.key key: number, @odata.query query: ODataQuery): Promise<Product> {
    const db = await connect();
    const sqlQuery = createQuery(query);
    const {rows} = await db.query(`SELECT ${sqlQuery.select} FROM "Products"
                                   WHERE "Id" = $${sqlQuery.parameters.length + 1} AND
                                         (${sqlQuery.where})`,[...sqlQuery.parameters, key]);
    return convertResults(rows)[0];
  }

  @odata.POST
  async insert( @odata.body data: any): Promise<Product> {
    const db = await connect();
    const {rows} = await insert(db, "Products", [data]);
    return convertResults(rows)[0];
  }

  @odata.PUT
  async upsert( @odata.key key: number, @odata.body data: any, @odata.context context: any): Promise<Product> {
    const db = await connect();
    const {rows} = await replace(db, "Products", key, data);
    return convertResults(rows)[0];
  }

  @odata.PATCH
  async update( @odata.key key: number, @odata.body delta: any): Promise<number> {
    const db = await connect();
    const {rows} = await update(db, "Products", key, delta);
    return convertResults(rows)[0];
  }

  @odata.DELETE
  async remove( @odata.key key: number): Promise<number> {
    const db = await connect();
    const {rowCount} = await db.query(`DELETE FROM "Products" WHERE "Id" = $1`, [key]);
    return rowCount;
  }


  @Edm.Function
  @Edm.Collection(Edm.EntityType(Product))
  async getInPriceRange( @Edm.Decimal min: number, @Edm.Decimal max: number): Promise<Product[]> {
    const db = await connect();
    const {rows} = await db.query(`SELECT * FROM "Products" WHERE "UnitPrice" >= $1 AND "UnitPrice" <= $2`, [min, max]);
    return convertResults(rows);
  }
}