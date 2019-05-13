"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config);
    }
    getProductById(productId) {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM products WHERE item_id=' + productId, (err, product) => {
                if (err)
                    reject(err);
                resolve(product[0]);
            });
        });
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
        const allProducts = await this.getAllProducts();
        this.printProducts(allProducts);
    }
    // Prints product argments in a nicely formatted table
    async printProducts(products) {
        const values = [];
        const headers = ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity', 'product_sales'];
        products.forEach(product => {
            const colData = [];
            colData.push(product.item_id);
            colData.push(product.product_name);
            colData.push(product.department_name);
            colData.push(product.price);
            colData.push(product.stock_quantity);
            colData.push(product.product_sales);
            values.push(colData);
        });
        console.table(headers, values);
    }
    // Checks if product exists in DB
    async productExists(productId) {
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
    async stockExists(productId, unitsToBuy) {
        try {
            const product = await this.getProductById(productId);
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
    async decreaseStock(productId, unitsToBuy) {
        try {
            if (await this.stockExists(productId, unitsToBuy) && unitsToBuy >= 0) {
                const product = await this.getProductById(productId).then((item) => {
                    return item;
                });
                const newStock = product.stock_quantity - unitsToBuy;
                const totalPrice = unitsToBuy * product.price;
                const newProductSales = product.product_sales + totalPrice;
                await this.connection.query("UPDATE products SET ? WHERE ?", [
                    {
                        stock_quantity: newStock,
                        product_sales: newProductSales,
                    },
                    {
                        item_id: productId,
                    },
                ]);
                return { product, unitsToBuy, totalPrice };
            }
            else {
                return {};
            }
        }
        catch (err) {
            console.log(err);
            return {};
        }
    }
    // Displays all products with a stock_quantity < 5
    printLowStockProducts() {
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT * from products WHERE stock_quantity < 5;", (err, products) => {
                if (err)
                    reject(err);
                if (products.length) {
                    this.printProducts(products);
                }
                else {
                    console.log("There are no low stock products.");
                }
                resolve();
            });
        });
    }
    // Increase an existing product's inventory by a given amount
    increaseInventory(itemId, amountToAdd) {
        return new Promise((resolve, reject) => {
            if (amountToAdd < 0) {
                console.log('amountToAdd must be >= 0');
                return;
            }
            this.connection.query("UPDATE products SET stock_quantity = stock_quantity + " + amountToAdd + " WHERE item_id = " + itemId + ";", (err, res) => {
                if (err) {
                    reject(err);
                }
                console.log(res.affectedRows + " product inserted!\n");
                resolve();
            });
        });
    }
    // Add a new product to the DB
    addNewProduct(product) {
        return new Promise((resolve, reject) => {
            if (product.price < 0) {
                console.log('price must be >= 0');
                reject();
            }
            if (product.stock_quantity < 0) {
                console.log('stock_quantity must be >= 0');
                reject();
            }
            this.connection.query("INSERT INTO products SET ?", product, (err, res) => {
                if (err) {
                    reject(err);
                }
                console.log(res.affectedRows + " product inserted!\n");
                resolve();
            });
        });
    }
    printStatsForSupervisor() {
        return new Promise((resolve, reject) => {
            this.connection.query("WITH previous_query AS ("
                + "SELECT department_name, SUM(product_sales) AS 'product_sales'"
                + "FROM products"
                + "GROUP BY 1"
                + ")"
                + "SELECT departments.*, previous_query.product_sales, (previous_query.product_sales - departments.over_head_costs) AS total_profit"
                + "FROM departments"
                + "JOIN previous_query"
                + "WHERE departments.department_name = previous_query.department_name"
                + "GROUP BY department_id;"), (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            };
        });
    }
    // End connection to DB
    close() {
        this.connection.end((err) => {
            if (err) {
                console.log(err);
            }
        });
    }
}
exports.Database = Database;
//# sourceMappingURL=database.js.map