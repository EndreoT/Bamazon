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


async function main() {
  const database = new Database(config);
  await database.printAllProducts();
  
  inquirer
    .prompt({
      name: "id",
      type: "number",
      message: "Choose an item id to purchase",
      validate(answer: number) {
        if (!answer) {
          return false;
        }
        return Number.isInteger(answer);
      },
    }).then((answer: { id: number }) => {
      validateProductId(answer.id, database);
    });
}

function validateProductId(productId: number, database: Database) {
  database.productExists(productId).then(response => {
    if (response) {
      selectProductQuantity(productId, database);
    } else {
      console.log('Item with id ' + productId + ' does not exit. Please try again and select a different product id.');
      database.close();
    }
  });
}

function selectProductQuantity(productId: number, database: Database) {
  inquirer.prompt({
    name: "units",
    type: "number",
    message: "Choose a number of units to purchase",
    validate(answer: number) {
      if (!answer) {
        return false;
      }
      return Number.isInteger(answer);
    },
  }).then((answer: { units: number }) => {
    database.stockExists(productId, answer.units).then((response: boolean) => {
      if (response) {
        makePurchase(productId, answer.units, database);
      } else {
        console.log('Insufficient quantity for item with id ' + productId + '! Please try again and choose a different number of units.');
        database.close();
      }
    });
  });
}

async function makePurchase(productId: number, units: number, database: Database) {
  const result = await database.updateStock(productId, units);
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
  database.close();
}


main();
