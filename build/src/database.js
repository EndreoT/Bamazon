"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
// interface Config {
//   host: string;
//   port: number;
//   user: string;
//   password: string;
//   database: string;
// }
class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config);
    }
    getAllProducts() {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM products', (err, rows) => {
                if (err)
                    reject(err);
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
        this.connection.end((err) => {
            if (err) {
                console.log(err);
            }
        });
    }
}
exports.Database = Database;
//# sourceMappingURL=database.js.map