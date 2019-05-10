import * as mysqlTypes from "../node_modules/@types/mysql";
import mysql = require('mysql');


interface ProductData {
  item_id: number;
  product_name: string;
  department_name: string;
  price: number;
  stock_quantity: number;
}

export class Database {
  connection: mysqlTypes.Connection;

  constructor(config: mysqlTypes.ConnectionConfig) {
    this.connection = mysql.createConnection(config);
  }

  getAllProducts(): Promise<ProductData[]> {
    return new Promise((resolve, reject) => {
      this.connection.query('SELECT * FROM products', (err: mysqlTypes.MysqlError, rows: ProductData[]) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  async printAllProducts(): Promise<void> {
    try {
      const rowsResult: ProductData[] = await this.getAllProducts().then((rows: ProductData[]) => {
        return rows;
      });
      const values: any[] = [];

      const headers: string[] = ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity'];

      rowsResult.forEach(product => {
        const colData: Array<string | number> = [];
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

  getProductById(productId: number): Promise<ProductData[]> {
    return new Promise((resolve, reject) => {
      this.connection.query(
        'SELECT * FROM products WHERE item_id=' + productId,
        (err: mysqlTypes.MysqlError, row: ProductData[]) => {
          if (err) reject(err);
          resolve(row);
        });
    });
  }

  async productExists(productId: number): Promise<boolean> {
    if (productId === null) {
      return false;
    }
    return this.getProductById(productId).then((product: ProductData[]) => {
      if (product.length === 1) {
        return true;
      } 
      return false;
    }).catch((err: string) => {
      console.log(err);
      return false;
    });
  }

  async stockExists(productId: number, unitsToBuy: number): Promise<boolean> {
    try {
      const product = await this.getProductById(productId);
      if (product[0].stock_quantity >= unitsToBuy) {
        return true;
      }
      return false;
    }
    catch (err) {
      console.log(err);
      return false;
    }
  }

  // Returns total price
  async updateStock(productId: number, unitsToBuy: number): Promise<{product?: ProductData, unitsToBuy?: number, totalPrice?: number}> {
    try {
      if (await this.stockExists(productId, unitsToBuy)) {
        const product = await this.getProductById(productId).then((item: ProductData[]) => {
          return item[0];
        });
        const newStock: number = product.stock_quantity - unitsToBuy;
        const totalPrice: number = unitsToBuy * product.price;
        await this.connection.query("UPDATE products SET ? WHERE ?", 
        [
          {
            stock_quantity: newStock,
          },
          {
            item_id: productId,
          },
        ]);
        return {product, unitsToBuy, totalPrice};
      } else {
        return {};
      }
    } catch (err) {
      console.log(err);
      return {};
    }
    
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
