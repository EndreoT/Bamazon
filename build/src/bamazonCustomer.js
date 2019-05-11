"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const inquirer = require('inquirer');
require('console.table');
const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'bamazon',
};
async function main() {
    const database = new database_1.Database(config);
    await database.printAllProducts();
    inquirer
        .prompt({
        name: "id",
        type: "number",
        message: "Choose an item id to purchase",
        validate(answer) {
            if (!answer) {
                return false;
            }
            return Number.isInteger(answer);
        },
    }).then((answer) => {
        validateProductId(answer.id, database);
    });
}
function validateProductId(productId, database) {
    database.productExists(productId).then((response) => {
        if (response) {
            selectProductQuantity(productId, database);
        }
        else {
            console.log('Item with id ' + productId + ' does not exit. Please try again and select a different product id.');
            database.close();
        }
    });
}
function selectProductQuantity(productId, database) {
    inquirer.prompt({
        name: "units",
        type: "number",
        message: "Choose a number of units to purchase",
        validate(answer) {
            if (!answer) {
                return false;
            }
            return Number.isInteger(answer);
        },
    }).then((answer) => {
        database.stockExists(productId, answer.units).then((response) => {
            if (response) {
                makePurchase(productId, answer.units, database);
            }
            else {
                console.log('Insufficient quantity for item with id ' + productId + '! Please try again and choose a different number of units.');
                database.close();
            }
        });
    });
}
async function makePurchase(productId, units, database) {
    const result = await database.decreaseStock(productId, units);
    if (result.product) {
        console.log("====================================");
        console.log('Purchase receipt');
        console.log("====================================");
        console.table([
            {
                'Item': result.product.product_name,
                'Units purchased': result.unitsToBuy,
                'Cost': result.totalPrice,
            },
        ]);
    }
    database.close();
}
main();
//# sourceMappingURL=bamazonCustomer.js.map