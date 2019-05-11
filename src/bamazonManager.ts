import { Database } from './database';

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

async function main() {
  const database = new Database(config);
  await database.printAllProducts();

  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Choose an option",
      // choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
      choices: [Choices.VIEW_PRODUCTS, Choices.LOW_INVENTORY, Choices.INC_INVENTORY, Choices.ADD_PRODUCT],
    }).then((answer: { action: string }) => {
      switch (answer.action) {
        case Choices.VIEW_PRODUCTS:
          database.printAllProducts();
          break;


        default:
          console.log('An error in selection occurred.');
          break;
      }
    });
}

main();