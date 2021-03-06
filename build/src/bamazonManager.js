"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = require('inquirer');
require('console.table');
const database_1 = require("./database");
const utils_1 = require("./utils");
var Choices;
(function (Choices) {
    Choices["VIEW_PRODUCTS"] = "View Products for Sale";
    Choices["LOW_INVENTORY"] = "View Low Inventory";
    Choices["INC_INVENTORY"] = "Add to Inventory";
    Choices["ADD_PRODUCT"] = "Add New Product";
})(Choices || (Choices = {}));
async function main() {
    const database = new database_1.Database(utils_1.config);
    inquirer
        .prompt({
        name: "action",
        type: "list",
        message: "Choose an option",
        choices: [Choices.VIEW_PRODUCTS, Choices.LOW_INVENTORY, Choices.INC_INVENTORY, Choices.ADD_PRODUCT],
    }).then((answer) => {
        switch (answer.action) {
            case Choices.VIEW_PRODUCTS:
                database.printAllProducts(true).then(() => {
                    database.close();
                });
                break;
            case Choices.LOW_INVENTORY:
                database.printLowStockProducts().then(() => {
                    database.close();
                });
                break;
            case Choices.INC_INVENTORY:
                incrementInventory(database);
                break;
            case Choices.ADD_PRODUCT:
                addNewProduct(database);
                break;
            default:
                console.log('An error in selection occurred.');
                break;
        }
    });
}
function incrementInventory(database) {
    inquirer.prompt([
        {
            name: "id",
            type: "number",
            message: "Choose a product id: ",
            validate(answer) {
                return utils_1.isInteger(answer);
            },
        },
        {
            name: "addToStock",
            type: "number",
            message: "Choose the number of units to add to stock: ",
            validate(answer) {
                return utils_1.isInteger(answer);
            },
        },
    ]).then((answer) => {
        const productId = answer.id;
        database.productExists(productId).then((response) => {
            if (response) {
                database.increaseInventory(productId, answer.addToStock).then(() => {
                    database.close();
                });
            }
            else {
                console.log('Item with id ' + productId + ' does not exist. Please try again and select a different product.');
                database.close();
            }
        });
    });
}
function addNewProduct(database) {
    inquirer.prompt([
        {
            name: "product_name",
            type: "input",
            message: "Item name",
            validate(answer) {
                return answer ? true : false;
            },
        },
        {
            name: "department_name",
            type: "input",
            message: "Department name",
            validate(answer) {
                return answer ? true : false;
            },
        },
        {
            name: "price",
            type: "number",
            message: "Price per unit",
            validate(answer) {
                return !isNaN(answer);
            },
        },
        {
            name: "stock_quantity",
            type: "number",
            message: "Product stock",
            validate(answer) {
                return utils_1.isInteger(answer);
            },
        },
    ]).then((answer) => {
        answer.product_sales = 0;
        database.addNewProduct(answer).then(() => {
            database.close();
        });
    });
}
main();
//# sourceMappingURL=bamazonManager.js.map