"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require('mysql');
const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'bamazon',
};
class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config);
        console.log(typeof this.connection);
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
        this.connection.end((err) => {
            if (err) {
                throw new Error(err);
            }
        });
    }
}
exports.Database = Database;
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
//# sourceMappingURL=database.js.map