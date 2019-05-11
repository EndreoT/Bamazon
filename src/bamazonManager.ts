import { Database } from './database';
import { isInteger, ProductShape } from './utils';

const inquirer = require('inquirer');
require('console.table');


const config = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '1234',
  database: 'bamazon',
};

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
          database.printAllProducts();
          break;

        case Choices.LOW_INVENTORY:
          database.printLowStockProducts();
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
      message: "Choose a product id",
      validate(answer: number) {
        return isInteger(answer);
      },
    },
    {
      name: "addToStock",
      type: "number",
      message: "Choose the number of units add to stock",
      validate(answer: number) {
        return isInteger(answer);
      },
    },
  ]).then((answer: { id: number, addToStock: number }) => {
    const productId = answer.id;
    database.productExists(productId).then((response: boolean) => {
      if (response) {
        database.increaseInventory(productId, answer.addToStock);
      } else {
        console.log('Ttem with id ' + productId + ' does not exist.');
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
    },
    {
      name: "department_name",
      type: "input",
      message: "Department name",
    },
    {
      name: "price",
      type: "number",
      message: "Price per unit",
      validate(answer: number) {
        return isInteger(answer);
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
    database.addNewProduct(answer);
  });
}

main();