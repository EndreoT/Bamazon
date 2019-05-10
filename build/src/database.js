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
    async printAllProducts() {
        try {
            const rowsResult = await this.getAllProducts().then(rows => {
                return rows;
            });
            const values = [];
            const headers = ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity'];
            rowsResult.forEach(product => {
                const colData = [];
                colData.push(product.item_id);
                colData.push(product.product_name);
                colData.push(product.department_name);
                colData.push(product.price);
                colData.push(product.stock_quantity);
                values.push(colData);
            });
            console.table(headers, values);
        }
        catch (err) {
            console.log(err);
            this.close();
        }
    }
    getProductById(productId) {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM products WHERE item_id=' + productId, (err, row) => {
                if (err)
                    reject(err);
                resolve(row);
            });
        });
    }
    async productExists(productId) {
        if (productId === null) {
            return false;
        }
        return this.getProductById(productId).then((product) => {
            if (product.length === 1) {
                return true;
            }
            console.log('Item with id ' + productId + ' does not exit.');
            return false;
        }).catch((err) => {
            console.log(err);
        });
    }
    stockExists(productId, unitsToBuy) {
        return this.getProductById(productId).then((product) => {
            if (product[0].stock_quantity >= unitsToBuy) {
                return true;
            }
            console.log('Item with id ' + productId + ' does not not have enough stock.');
            return false;
        }).catch((err) => {
            console.log(err);
        });
    }
    // Returns total price
    async updateStock(productId, unitsToBuy) {
        try {
            if (await this.stockExists(productId, unitsToBuy)) {
                const product = await this.getProductById(productId).then((item) => {
                    return item[0];
                });
                const newStock = product.stock_quantity - unitsToBuy;
                const totalPrice = unitsToBuy * product.price;
                console.log(newStock, totalPrice);
                await this.connection.query("UPDATE products SET ? WHERE ?", [
                    {
                        stock_quantity: newStock,
                    },
                    {
                        item_id: productId,
                    },
                ]);
                return totalPrice;
            }
            else {
                return -1;
            }
        }
        catch (err) {
            console.log(err);
            return -1;
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
    close() {
        this.connection.end((err) => {
            if (err) {
                console.log(err);
            }
        });
    }
}
exports.Database = Database;
// const config = {
//   host: 'localhost',
//   port: 3306,
//   user: 'root',
//   password: '1234',
//   database: 'bamazon',
// };
// const database = new Database(config);
// database.productExists(44);
//# sourceMappingURL=database.js.map