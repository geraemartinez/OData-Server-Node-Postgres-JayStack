  
import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { createQuery } from "odata-v4-pg";
import convertResults  from "./../utils/convertResults";
import { User } from "../models/User";
import connect from "./../utils/connect";
import insert from "./../utils/insert";
import replace from "./../utils/replace";
import update from "./../utils/update";

@odata.type(User)
export class UsersController extends ODataController {

  @odata.GET
  async select( @odata.query query: ODataQuery): Promise<User[]> {
    const db = await connect();
    const sqlQuery = createQuery(query);
    const {rows} = await db.query(sqlQuery.from('"User"'), sqlQuery.parameters);
    return convertResults(rows);
  }

  @odata.GET
  async selectOne( @odata.key key: number, @odata.query query: ODataQuery): Promise<User> {
    const db = await connect();
    const sqlQuery = createQuery(query);
    const {rows} = await db.query(`SELECT ${sqlQuery.select} FROM "User"
                                   WHERE "Id" = $${sqlQuery.parameters.length + 1} AND
                                         (${sqlQuery.where})`,[...sqlQuery.parameters, key]);
    return convertResults(rows)[0];
  }

  @odata.POST
  async insert( @odata.body data: any): Promise<User> {
    const db = await connect();
    const {rows} = await insert(db, "User", [data]);
    return convertResults(rows)[0];
  }

  @odata.PUT
  async upsert( @odata.key key: number, @odata.body data: any, @odata.context context: any): Promise<User> {
    const db = await connect();
    const {rows} = await replace(db, "User", key, data);
    return convertResults(rows)[0];
  }

  @odata.PATCH
  async update( @odata.key key: number, @odata.body delta: any): Promise<number> {
    const db = await connect();
    const {rows} = await update(db, "User", key, delta);
    return convertResults(rows)[0];
  }

  @odata.DELETE
  async remove( @odata.key key: number): Promise<number> {
    const db = await connect();
    const {rowCount} = await db.query(`DELETE FROM "User" WHERE "Id" = $1`, [key]);
    return rowCount;
  }

}