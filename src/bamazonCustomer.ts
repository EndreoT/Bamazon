import { Database } from './database';
import * as mysqlTypes from "../node_modules/@types/mysql";
import { get } from 'https';

const inquirer = require('inquirer');
const cTable = require('console.table');


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
  // try {
  //   await database.printAllProducts();
  //   const productId = await getProductId(database);
  //   console.log(productId)
  //   const y = await getProductId(database)
  //   console.log(y)
  //   database.close()
  // } catch (err) {
  //   console.log(err)
  // }
  // const products = await database.getAllProducts();
  // printAllProducts(products)

  inquirer
    .prompt({
      name: "id",
      type: "number",
      message: "Choose an item id to purchase",
      validate(anwer: number) {
        return Number.isInteger(anwer);
      },
    }).then((answer: { id: number }) => {
      validateProductId(answer.id, database);
    });
}

main();

// async function getProductId(database: Database): Promise<any> {
//   try {
//     const chosenProductId: { id: number } = await inquirer
//       .prompt({
//         name: "id",
//         type: "number",
//         message: "Choose an item id to purchase",
//         async validate(productId: number) {
//           const x = await database.productExists(productId).then(res => {
//             console.log(res)
//             return res
//           })
//           return x; 
//         },
//       });
//     return chosenProductId.id;
//   } catch (err) {
//     console.log(err)
//   }
// }


function validateProductId(productId: number, database: Database) {
  database.productExists(productId).then(response => {
    console.log(response)
    if (response) {
      selectProductQuantity(productId, database)
    } else {
      console.log('Product does not exits');
      database.close();
    }
  })
}

function selectProductQuantity(productId: number, database: Database) {
  inquirer.prompt({
      name: "units",
      type: "number",
      message: "Choose a number of units to purchase",
      validate(anwer: number) {
        return Number.isInteger(anwer);
      },
    }).then((answer: {units: number}) => {
      database.stockExists(productId, answer.units).then((response: boolean) => {
        if (response) {
          console.log('can buy')
          makePurchase(productId, answer.units, database)
        } else {
          console.log('cannot buy')
          database.close();
        }
      })

    })
}

async function makePurchase(productId: number, units: number, database: Database) {
  const totalPrice: number = await database.updateStock(productId, units)
  console.log(totalPrice)
  database.close();

}


// function validateProductId(productId: number, products: any[]): boolean {
//   for (let i = 0; i < products.length; i++) {
//     if (products[i].item_id === productId) {
//       return true;
//     }
//   }
//   console.log('Item with id ' + productId + ' does not exit.');
//   return false;
// }


async function printAllProducts(productList: any[]): Promise<any> {
  const values: any = [];

  const headers: string[] = ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity'];

  productList.forEach(product => {
    const colData: string | number[] = [];
    colData.push(product.item_id);
    colData.push(product.product_name);
    colData.push(product.department_name);
    colData.push(product.price);
    colData.push(product.stock_quantity);
    values.push(colData);
  });

  console.table(headers, values)
}


// getAllProducts()

// async function get() {
//   try {
//     const someRows = await database.query('SELECT * FROM some_table').then(rows => {
//       return rows
//     })
//     console.log(someRows)
//   } catch (err) {
//     console.log(err)
//   }

//   database.close()
// }

// get()


// function which prompts the user for what action they should take
// function start() {
//   inquirer
//     .prompt({
//       name: "postOrBid",
//       type: "list",
//       message: "Would you like to [POST] an auction or [BID] on an auction?",
//       choices: ["POST", "BID", "EXIT"]
//     })
//     .then(function(answer) {
//       // based on their answer, either call the bid or the post functions
//       if (answer.postOrBid === "POST") {
//         postAuction();
//       }
//       else if(answer.postOrBid === "BID") {
//         bidAuction();
//       } else{
//         connection.end();
//       }
//     });
// }

// // function to handle posting new items up for auction
// function postAuction() {
//   // prompt for info about the item being put up for auction
//   inquirer
//     .prompt([
//       {
//         name: "item",
//         type: "input",
//         message: "What is the item you would like to submit?"
//       },
//       {
//         name: "category",
//         type: "input",
//         message: "What category would you like to place your auction in?"
//       },
//       {
//         name: "startingBid",
//         type: "input",
//         message: "What would you like your starting bid to be?",
//         validate: function(value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         }
//       }
//     ])
//     .then(function(answer) {
//       // when finished prompting, insert a new item into the db with that info
//       connection.query(
//         "INSERT INTO auctions SET ?",
//         {
//           item_name: answer.item,
//           category: answer.category,
//           starting_bid: answer.startingBid || 0,
//           highest_bid: answer.startingBid || 0
//         },
//         function(err) {
//           if (err) throw err;
//           console.log("Your auction was created successfully!");
//           // re-prompt the user for if they want to bid or post
//           start();
//         }
//       );
//     });
// }