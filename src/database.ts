import * as mysqlTypes from "../node_modules/@types/mysql";
import mysql = require('mysql');


// interface Config {
//   host: string;
//   port: number;
//   user: string;
//   password: string;
//   database: string;
// }

export class Database {
  connection: mysqlTypes.Connection;
  
  constructor(config: mysqlTypes.ConnectionConfig) {
    this.connection = mysql.createConnection(config);  
  }

   getAllProducts(): Promise<mysqlTypes.QueryFunction[]> {
    return new Promise((resolve, reject) => {
      this.connection.query('SELECT * FROM products', (err: mysqlTypes.MysqlError, rows: mysqlTypes.QueryFunction[]) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  // query(sql, args) {
  //   return new Promise((resolve, reject) => {
  //     this.connection.query('SELECT * FROM bids', (err, rows) => {
  //       if (err) reject(err);
  //       resolve(rows);
  //     });
  //   });
  // }

  async close() {
    this.connection.end((err: mysqlTypes.MysqlError) => {
      if (err) {
        console.log(err);
      }
    });
  }
}



