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
var Choices;
(function (Choices) {
    Choices["VIEW_PRODUCTS"] = "View Products for Sale";
    Choices["LOW_INVENTORY"] = "View Low Inventory";
    Choices["INC_INVENTORY"] = "Add to Inventory";
    Choices["ADD_PRODUCT"] = "Add New Product";
})(Choices || (Choices = {}));
async function main() {
    const database = new database_1.Database(config);
    inquirer
        .prompt({
        name: "action",
        type: "list",
        message: "Choose an option",
        // choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
        choices: [Choices.VIEW_PRODUCTS, Choices.LOW_INVENTORY, Choices.INC_INVENTORY, Choices.ADD_PRODUCT],
    }).then((answer) => {
        switch (answer.action) {
            case Choices.VIEW_PRODUCTS:
                database.printAllProducts();
                break;
            case Choices.LOW_INVENTORY:
                database.printLowStockProducts();
                break;
            case Choices.INC_INVENTORY:
                break;
            case Choices.ADD_PRODUCT:
                break;
            default:
                console.log('An error in selection occurred.');
                break;
        }
    });
}
main();
//# sourceMappingURL=bamazonManager.js.map