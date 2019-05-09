import * as mysqlTypes from "../node_modules/@types/mysql";
import mysql = require('mysql');


const config = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '1234',
  database: 'bamazon',
};

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



const database = new Database(config);

// async function get() {
//   try {
//     const someRows = await database.query('SELECT * FROM some_table').then(rows => {
//       return rows
//     })
//     console.log(someRows)
//   } catch (err) {
//     console.log(err)
//   }

//   database.close()
// }

// get()