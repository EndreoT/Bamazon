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
    // Prints product argments in a nicely formatted  table
    printProducts(products) {
        const values = [];
        const headers = ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity'];
        products.forEach(product => {
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
            // const product: ProductData = await this.getProductById(productId);
            if (await this.stockExists(productId, unitsToBuy)) {
                const product = await this.getProductById(productId).then((item) => {
                    return item;
                });
                const newStock = product.stock_quantity - unitsToBuy;
                const totalPrice = unitsToBuy * product.price;
                await this.connection.query("UPDATE products SET ? WHERE ?", [
                    {
                        stock_quantity: newStock,
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
        this.connection.query("SELECT * from products WHERE stock_quantity < 5;", (err, products) => {
            if (err)
                return console.log(err);
            this.printProducts(products);
        });
    }
    // Increase an existing product's inventory by a given amount
    increaseInventory(itemId, incrementAmount) {
        this.connection.query("UPDATE products SET stock_quantity = stock_quantity + " + incrementAmount + " WHERE item_id = " + itemId + ";");
    }
    // Add a new product to the DB
    addNewProduct(product) {
        this.connection.query("INSERT INTO products SET ?", product, (err, res) => {
            if (err) {
                return console.log(err);
            }
            console.log(res.affectedRows + " product inserted!\n");
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