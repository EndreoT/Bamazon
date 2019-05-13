"use strict";
// import { Database } from './database';
// import { config, ProductShape } from './utils';
// const inquirer = require('inquirer');
// require('console.table');
// enum Choices {
//   VIEW_PRODUCTS = 'View Products for Sale',
//   LOW_INVENTORY = 'View Low Inventory',
//   INC_INVENTORY = 'Add to Inventory',
//   ADD_PRODUCT = 'Add New Product',
// }
// async function main(): Promise<void> {
//   const database = new Database(config);
//   inquirer
//     .prompt({
//       name: "action",
//       type: "list",
//       message: "Choose an option",
//       choices: [Choices.VIEW_PRODUCTS, Choices.LOW_INVENTORY, Choices.INC_INVENTORY, Choices.ADD_PRODUCT],
//     }).then((answer: { action: string }) => {
//       switch (answer.action) {
//         case Choices.VIEW_PRODUCTS:
//           database.printAllProducts();
//           break;
//         case Choices.LOW_INVENTORY:
//           database.printLowStockProducts();
//           break;
//         default:
//           console.log('An error in selection occurred.');
//           break;
//       }
//     });
// }
// function incrementInventory(database: Database) {
//   inquirer.prompt([
//     {
//       name: "id",
//       type: "number",
//       message: "Choose a product id: ",
//       validate(answer: number) {
//         return isInteger(answer);
//       },
//     },
//     {
//       name: "addToStock",
//       type: "number",
//       message: "Choose the number of units to add to stock: ",
//       validate(answer: number) {
//         return isInteger(answer);
//       },
//     },
//   ]).then((answer: { id: number, addToStock: number }) => {
//     const productId = answer.id;
//     database.productExists(productId).then((response: boolean) => {
//       if (response) {
//         database.increaseInventory(productId, answer.addToStock);
//       } else {
//         console.log('Item with id ' + productId + ' does not exist.');
//         database.close();
//       }
//     });
//   });
// }
// function addNewProduct(database: Database) {
//   inquirer.prompt([
//     {
//       name: "product_name",
//       type: "input",
//       message: "Item name",
//       validate(answer: string) {
//         return answer ? true : false; 
//       },
//     },
//     {
//       name: "department_name",
//       type: "input",
//       message: "Department name",
//       validate(answer: string) {
//         return answer ? true : false; 
//       },
//     },
//     {
//       name: "price",
//       type: "number",
//       message: "Price per unit",
//       validate(answer: number) {
//         return isInteger(answer);
//       },
//     },
//     {
//       name: "stock_quantity",
//       type: "number",
//       message: "Product stock",
//       validate(answer: number) {
//         return isInteger(answer);
//       },
//     },
//   ]).then((answer: ProductShape) => {
//     database.addNewProduct(answer);
//   });
// }
// main();
//# sourceMappingURL=supervisor.js.map