// Type definition for mysql
import * as mysqlTypes from "../node_modules/@types/mysql";

import mysql = require('mysql');

import { ProductShape } from './utils';


interface ProductData {
  item_id: number;
  product_name: string;
  department_name: string;
  price: number;
  stock_quantity: number;
  product_sales: number;
}

export class Database {
  connection: mysqlTypes.Connection;

  constructor(config: mysqlTypes.ConnectionConfig) {
    this.connection = mysql.createConnection(config);
  }

  getProductById(productId: number): Promise<ProductData> {
    return new Promise((resolve, reject) => {
      this.connection.query(
        'SELECT * FROM products WHERE item_id=' + productId,
        (err: mysqlTypes.MysqlError, product: ProductData[]) => {
          if (err) reject(err);
          resolve(product[0]);
        });
    });
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
    const allProducts: ProductData[] = await this.getAllProducts();
    this.printProducts(allProducts);
  }

  // Prints product argments in a nicely formatted table
  printProducts(products: ProductData[]): void {
    const values: any[] = [];

    const headers: string[] = ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity'];

    products.forEach(product => {
      const colData: Array<string | number> = [];
      colData.push(product.item_id);
      colData.push(product.product_name);
      colData.push(product.department_name);
      colData.push(product.price);
      colData.push(product.stock_quantity);
      values.push(colData);
    });

    console.table(headers, values);
  }

  // Checks if product exists in DB
  async productExists(productId: number): Promise<boolean> {
    if (productId === null) {
      return false;
    }
    try {
      const product = await this.getProductById(productId);
      if (product) {
        return true;
      }
      return false;
    }
    catch (err) {
      console.log(err);
      return false;
    }
  }

  // Check if enough units of product can be purchased
  async stockExists(productId: number, unitsToBuy: number): Promise<boolean> {
    try {
      const product: ProductData = await this.getProductById(productId);
      if (product.stock_quantity >= unitsToBuy) {
        return true;
      }
      return false;
    }
    catch (err) {
      console.log(err);
      return false;
    }
  }

  // Decreases stock for an item and returns trasaction information
  async decreaseStock(productId: number, unitsToBuy: number): Promise<{ product?: ProductData, unitsToBuy?: number, totalPrice?: number }> {
    try {
      if (await this.stockExists(productId, unitsToBuy) && unitsToBuy >= 0) {
        const product: ProductData = await this.getProductById(productId).then((item: ProductData) => {
          return item;
        });
        const newStock: number = product.stock_quantity - unitsToBuy;
        const totalPrice: number = unitsToBuy * product.price;
        const newProductSales: number = product.product_sales + totalPrice;
        await this.connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: newStock,
              product_sales: newProductSales,
            },
            {
              item_id: productId,
            },
          ]);
        return { product, unitsToBuy, totalPrice };
      } else {
        return {};
      }
    } catch (err) {
      console.log(err);
      return {};
    }
  }

  // Displays all products with a stock_quantity < 5
  printLowStockProducts(): void {
    this.connection.query(
      "SELECT * from products WHERE stock_quantity < 5;",
      (err: mysqlTypes.MysqlError, products: ProductData[]) => {
        if (err) return console.log(err);
        this.printProducts(products);
      });
  }

  // Increase an existing product's inventory by a given amount
  increaseInventory(itemId: number, amountToAdd: number): void {
    if (amountToAdd < 0) {
      console.log('amountToAdd must be >= 0');
      return;
    }
    this.connection.query(
      "UPDATE products SET stock_quantity = stock_quantity + " + amountToAdd + " WHERE item_id = " + itemId + ";",
      (err, res) => {
        if (err) {
          return console.log(err);
        }
        console.log(res.affectedRows + " product inserted!\n");
      }
    );
  }

  // Add a new product to the DB
  addNewProduct(product: ProductShape): void {
    if (product.price < 0) {
      console.log('price must be >= 0');
      return;
    }
    if (product.stock_quantity < 0) {
      console.log('stock_quantity must be >= 0');
      return;
    }
    this.connection.query(
      "INSERT INTO products SET ?",
      product,
      (err, res) => {
        if (err) {
          return console.log(err);
        }
        console.log(res.affectedRows + " product inserted!\n");
      }
    );
  }

  // End connection to DB
  close(): void {
    this.connection.end((err: mysqlTypes.MysqlError) => {
      if (err) {
        console.log(err);
      }
    });
  }
}
