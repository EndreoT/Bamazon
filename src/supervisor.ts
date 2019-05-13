const inquirer = require('inquirer');
require('console.table');

import { Database } from './database';
import { config, ProductShape, isInteger } from './utils';


enum Choices {
  SALES_BY_PRODUCT = 'View Sales By Product',
  CREATE_DEPARTMENT = 'Create New Department',
}

async function main(): Promise<void> {
  const database = new Database(config);

  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Choose an option",
      choices: [Choices.SALES_BY_PRODUCT, Choices.CREATE_DEPARTMENT],
    }).then((answer: { action: string }) => {
      switch (answer.action) {

        case Choices.SALES_BY_PRODUCT:
          database.printStatsForSupervisor().then(() => {
            database.close();
          });
          break;

        case Choices.CREATE_DEPARTMENT:
          createDepartment(database);
          break;

        default:
          console.log('An error in selection occurred.');
          break;
      }
    });
}

function createDepartment(database: Database) {
  inquirer.prompt([
    {
      name: "department_name",
      type: "input",
      message: "Department name",
      validate(answer: string) {
        return answer ? true : false;
      },
    },
    {
      name: "over_head_costs",
      type: "number",
      message: "Over head costs for department",
      validate(answer: number) {
        return isInteger(answer);
      },
    },
  ]).then((answer: { department_name: string, over_head_costs: number }) => {
    database.addDepartment(answer).then(() => {
      database.close();
    });
  });
}

main();
