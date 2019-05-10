import { Database } from './database';
import * as mysqlTypes from "../node_modules/@types/mysql";

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
  const res: any = await getAllProducts(database);
  console.table(res.headers, res.values);

  const action = await inquirer
    .prompt({
      name: "action",
      type: "input",
      message: "Choose an item id to purchase",
      validate: (productId: string) => validateProductId(productId, res.values),
    });
  


}

main();


function validateProductId(productId: string, products: string[]): boolean {
  for (let i = 0; i < products.length; i++) {
    if (products[i][0] === productId) {
      return true;
    }
  }
  console.log('Item with id ' + productId + ' does not exit.');
  return false;
}


async function getAllProducts(database: Database): Promise<any> {
  try {
    const someRows: any[] = await database.getAllProducts().then(rows => {
      return rows;
    });
    const values: any = [];

    const headers: string[] = ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity'];

    someRows.forEach(product => {
      const colData: string | number[] = [];
      colData.push(product.item_id);
      colData.push(product.product_name);
      colData.push(product.department_name);
      colData.push(product.price);
      colData.push(product.stock_quantity);
      values.push(colData);
    });

    return {'headers': headers, values};

  } catch (err) {
    console.log(err);
    database.close();
  }
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