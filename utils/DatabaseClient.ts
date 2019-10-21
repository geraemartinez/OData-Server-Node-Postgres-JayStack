import * as pg from "pg";
import { flatten } from "ramda";
import DataBaseProxyHandler from "./DataBaseProxyHandler"

class DatabaseClient {
 
    
    static db: pg.Client;

    public static async connect (): Promise<pg.Client> {

        if (DatabaseClient.db){
            return DatabaseClient.db;
        }
            
        const pool = new pg.Pool({
            host:'192.168.0.3',
            user: 'postgres',
            password: 'postgres',
            database: 'postgres'
        });
        
        return new Promise<pg.Client>((resolve: Function, reject: Function) => {
            pool.connect((err, client) => {
                if (err){
                    return reject(err);
                }else{
                    DatabaseClient.db = this.promisify(client);
                    resolve(DatabaseClient.db);
                } 
            });
        });
    }

    public static async insert (db: pg.Client, tableName: string, items: any[], propertyNameProjection?: string[], types?: string[]):Promise<any> {
        if (items.length === 0)
          return;
        
        const properties = propertyNameProjection || Object.keys(items[0]);
      
        const clause = `INSERT INTO "${tableName}"
                                        (${properties.map(propName => `"${propName}"`).join(', ')})
                                    VALUES
                                        ${this.getPrepareClause(items, types)}
                                    RETURNING *`;
      
        const values = flatten(items.map(item => properties.map(propName => item[propName])));
      
        const insertionResult = await db.query(clause, values);
      
        await this.ensureIdIncrement(db, tableName, items);
      
        return insertionResult;
    }

    public static async replace (db: pg.Client, tableName: string, id: number, item: any):Promise<any> {
        await db.query(`DELETE FROM "${tableName}" WHERE "Id" = $1`, [id]);
        return await this.insert(db, tableName, [Object.assign({}, item, { Id: id })]);
    }

    public static async update (db: pg.Client, tableName: string, id: number, delta: any):Promise<any> {

        const properties = Object.keys(delta);
        const clause = `UPDATE "${tableName}"
                        SET ${properties.map((propName, i) => `"${propName}" = $${i + 1}`).join(', ')}
                        WHERE "Id" = ${id}
                        RETURNING *`;
        const values = properties.map(propName => delta[propName]);
        return await db.query(clause, values);
    }

    public static convertResult (rows:any[]):any {
        return rows.map(row =>
          Object.assign({}, this.filterNullValues(row), "UnitPrice" in row && row.UnitPrice !== null ?
            { UnitPrice: parseFloat(row.UnitPrice) } :
            {}
          )
        );
    }

    private static getPrepareClause(items: any[], types?: string[]): string {
        const metaColumns = Array.from({ length: Object.keys(items[0]).length });
        return items.map(
        (item, i) => '(' + metaColumns.map(
            (_, j) => types ? `$${i * metaColumns.length + j + 1}::${types[j]}` : `$${i * metaColumns.length + j + 1}`
        ).join(', ') + ')'
        ).join(',\n');
    }
      
    private static async ensureIdIncrement(db: pg.Client, tableName: string, items: any[]):Promise<any> {
        if (!items.some(item => "Id" in item)){
          return;
        }
        const {rows: [{"?column?": max}]} = await db.query(`SELECT MAX("Id")+1 FROM "${tableName}"`);
        await db.query(`ALTER SEQUENCE "${tableName}_Id_seq" RESTART WITH ${max}`);
    }

    private static promisify(client: any):any {
        return new Proxy(client, new DataBaseProxyHandler());
    }

    private static filterNullValues(item:any):any {
        const newItem = {};
        Object.keys(item)
          .filter(key => item[key] !== null)
          .forEach(key => newItem[key] = item[key]);
        return newItem;
    }

    
    
}

export default DatabaseClient