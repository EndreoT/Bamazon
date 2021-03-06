const inquirer = require('inquirer');
require('console.table');

import { Database } from './database';
import { config, isInteger, ProductShape } from './utils';


enum Choices {
  VIEW_PRODUCTS = 'View Products for Sale',
  LOW_INVENTORY = 'View Low Inventory',
  INC_INVENTORY = 'Add to Inventory',
  ADD_PRODUCT = 'Add New Product',
}

async function main(): Promise<void> {
  const database = new Database(config);

  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Choose an option",
      choices: [Choices.VIEW_PRODUCTS, Choices.LOW_INVENTORY, Choices.INC_INVENTORY, Choices.ADD_PRODUCT],
    }).then((answer: { action: string }) => {
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

function incrementInventory(database: Database) {
  inquirer.prompt([
    {
      name: "id",
      type: "number",
      message: "Choose a product id: ",
      validate(answer: number) {
        return isInteger(answer);
      },
    },
    {
      name: "addToStock",
      type: "number",
      message: "Choose the number of units to add to stock: ",
      validate(answer: number) {
        return isInteger(answer);
      },
    },
  ]).then((answer: { id: number, addToStock: number }) => {
    const productId = answer.id;
    database.productExists(productId).then((response: boolean) => {
      if (response) {
        database.increaseInventory(productId, answer.addToStock).then(() => {
          database.close();
        });
      } else {
        console.log('Item with id ' + productId + ' does not exist. Please try again and select a different product.');
        database.close();
      }
    });
  });
}

function addNewProduct(database: Database) {
  inquirer.prompt([
    {
      name: "product_name",
      type: "input",
      message: "Item name",
      validate(answer: string) {
        return answer ? true : false; 
      },
    },
    {
      name: "department_name",
      type: "input",
      message: "Department name",
      validate(answer: string) {
        return answer ? true : false; 
      },
    },
    {
      name: "price",
      type: "number",
      message: "Price per unit",
      validate(answer: number) {
        return !isNaN(answer);
      },
    },
    {
      name: "stock_quantity",
      type: "number",
      message: "Product stock",
      validate(answer: number) {
        return isInteger(answer);
      },
    },
  ]).then((answer: ProductShape) => {
    answer.product_sales = 0;
    database.addNewProduct(answer).then(() => {
      database.close();
    });
  });
}

main();
