  
import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { createQuery } from "odata-v4-pg";
//import convertResults  from "./../utils/convertResults";
import { User } from "../models/User";
import DatabaseClient from "../utils/DatabaseClient"


@odata.type(User)
export class UsersController extends ODataController {

  @odata.GET
  async select( @odata.query query: ODataQuery): Promise<User[]> {
    const db = await DatabaseClient.connect();
    const sqlQuery = createQuery(query);
    const {rows} = await db.query(sqlQuery.from('"User"'), sqlQuery.parameters);
    return DatabaseClient.convertResult(rows);
  }

  @odata.GET
  async selectOne( @odata.key key: number, @odata.query query: ODataQuery): Promise<User> {
    const db = await DatabaseClient.connect();
    const sqlQuery = createQuery(query);
    const {rows} = await db.query(`SELECT ${sqlQuery.select} FROM "User"
                                   WHERE "Id" = $${sqlQuery.parameters.length + 1} AND
                                         (${sqlQuery.where})`,[...sqlQuery.parameters, key]);
    return DatabaseClient.convertResult(rows)[0];
  }

  @odata.POST
  async insert( @odata.body data: any): Promise<User> {
    const db = await DatabaseClient.connect();
    const {rows} = await DatabaseClient.insert(db, "User", [data]);
    return DatabaseClient.convertResult(rows)(rows)[0];
  }

  @odata.PUT
  async upsert( @odata.key key: number, @odata.body data: any, @odata.context context: any): Promise<User> {
    const db = await DatabaseClient.connect();
    const {rows} = await DatabaseClient.replace(db, "User", key, data);
    return DatabaseClient.convertResult(rows)(rows)[0];
  }

  @odata.PATCH
  async update( @odata.key key: number, @odata.body delta: any): Promise<number> {
    const db = await DatabaseClient.connect();
    const {rows} = await DatabaseClient.update(db, "User", key, delta);
    return DatabaseClient.convertResult(rows)(rows)[0];
  }

  @odata.DELETE
  async remove( @odata.key key: number): Promise<number> {
    const db = await DatabaseClient.connect();
    const {rowCount} = await db.query(`DELETE FROM "User" WHERE "Id" = $1`, [key]);
    return rowCount;
  }

}