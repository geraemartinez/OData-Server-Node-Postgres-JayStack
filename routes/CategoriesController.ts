  
import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { createQuery } from "odata-v4-pg";
//import DatabaseClient.convertResult  from "./../utils/DatabaseClient.convertResult";
import { Category } from "../models/Category";
import DatabaseClient from "../utils/DatabaseClient"

@odata.type(Category)
export class CategoriesController extends ODataController {

  @odata.GET
  async select( @odata.query query: ODataQuery): Promise<Category[]> {
    const db = await DatabaseClient.connect();
    const sqlQuery = createQuery(query);
    const {rows} = await db.query(sqlQuery.from('"Category"'), sqlQuery.parameters);
    return DatabaseClient.convertResult(rows);
  }

  @odata.GET
  async selectOne( @odata.key key: number, @odata.query query: ODataQuery): Promise<Category> {
    const db = await DatabaseClient.connect();
    const sqlQuery = createQuery(query);
    const {rows} = await db.query(`SELECT ${sqlQuery.select} FROM "Category"
                                   WHERE "Id" = $${sqlQuery.parameters.length + 1} AND
                                         (${sqlQuery.where})`,[...sqlQuery.parameters, key]);
    return DatabaseClient.convertResult(rows)[0];
  }

  @odata.POST
  async insert( @odata.body data: any): Promise<Category> {
    const db = await DatabaseClient.connect();
    const {rows} = await DatabaseClient.insert(db, "Category", [data]);
    return DatabaseClient.convertResult(rows)[0];
  }

  @odata.PUT
  async upsert( @odata.key key: number, @odata.body data: any, @odata.context context: any): Promise<Category> {
    const db = await DatabaseClient.connect();
    const {rows} = await DatabaseClient.replace(db, "Category", key, data);
    return DatabaseClient.convertResult(rows)[0];
  }

  @odata.PATCH
  async update( @odata.key key: number, @odata.body delta: any): Promise<number> {
    const db = await DatabaseClient.connect();
    const {rows} = await DatabaseClient.update(db, "Category", key, delta);
    return DatabaseClient.convertResult(rows)[0];
  }

  @odata.DELETE
  async remove( @odata.key key: number): Promise<number> {
    const db = await DatabaseClient.connect();
    const {rowCount} = await db.query(`DELETE FROM "Category" WHERE "Id" = $1`, [key]);
    return rowCount;
  }


  @Edm.Function
  @Edm.Collection(Edm.EntityType(Category))
  async getInPriceRange( @Edm.Decimal min: number, @Edm.Decimal max: number): Promise<Category[]> {
    const db = await DatabaseClient.connect();
    const {rows} = await db.query(`SELECT * FROM "Category" WHERE "UnitPrice" >= $1 AND "UnitPrice" <= $2`, [min, max]);
    return DatabaseClient.convertResult(rows);
  }
}