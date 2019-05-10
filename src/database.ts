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

  async printAllProducts(): Promise<any> {
    try {
      const rowsResult: any[] = await this.getAllProducts().then(rows => {
        return rows;
      });
      const values: any[] = [];

      const headers: string[] = ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity'];

      rowsResult.forEach(product => {
        const colData: string | number[] = [];
        colData.push(product.item_id);
        colData.push(product.product_name);
        colData.push(product.department_name);
        colData.push(product.price);
        colData.push(product.stock_quantity);
        values.push(colData);
      });

      console.table(headers, values);

    } catch (err) {
      console.log(err);
      this.close();
    }
  }

  getProductById(productId: number): any {
    return new Promise((resolve, reject) => {
      this.connection.query(
        'SELECT * FROM products WHERE item_id=' + productId,
        (err: mysqlTypes.MysqlError, row: mysqlTypes.QueryFunction[]) => {
          if (err) reject(err);
          resolve(row);
        });
    });
  }

  async productExists(productId: number): Promise<boolean> {
    if (productId === null) {
      return false;
    }
    return this.getProductById(productId).then((product: any[]) => {
      if (product.length === 1) {
        return true;
      } 
      console.log('Item with id ' + productId + ' does not exit.');
      return false;
    }).catch((err: string) => {
      console.log(err);
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

  close(): void {
    this.connection.end((err: mysqlTypes.MysqlError) => {
      if (err) {
        console.log(err);
      }
    });
  }
}



// const config = {
//   host: 'localhost',
//   port: 3306,
//   user: 'root',
//   password: '1234',
//   database: 'bamazon',
// };


// const database = new Database(config);
// database.productExists(44);