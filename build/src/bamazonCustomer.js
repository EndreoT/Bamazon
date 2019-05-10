"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
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
    const database = new database_1.Database(config);
    const res = await getAllProducts(database);
    console.table(res.headers, res.values);
    const action = await inquirer
        .prompt({
        name: "postOrBid",
        type: "list",
        message: "Would you like to [POST] an auction or [BID] on an auction?",
        choices: ["POST", "BID", "EXIT"]
    });
    // .then(function(answer) {
    //   // based on their answer, either call the bid or the post functions
    //   if (answer.postOrBid === "POST") {
    //     postAuction();
    //   }
    //   else if(answer.postOrBid === "BID") {
    //     bidAuction();
    //   } else{
    //     connection.end();
    //   }
    // });
}
main();
async function getAllProducts(database) {
    try {
        const someRows = await database.getAllProducts().then(rows => {
            return rows;
        });
        const values = [];
        const headers = ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity'];
        someRows.forEach(product => {
            const colData = [];
            colData.push(product.item_id);
            colData.push(product.product_name);
            colData.push(product.department_name);
            colData.push(product.price);
            colData.push(product.stock_quantity);
            values.push(colData);
        });
        return { 'headers': headers, values };
    }
    catch (err) {
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
//# sourceMappingURL=bamazonCustomer.js.map