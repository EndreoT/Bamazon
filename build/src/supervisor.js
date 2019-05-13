"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const utils_1 = require("./utils");
const inquirer = require('inquirer');
require('console.table');
var Choices;
(function (Choices) {
    Choices["SALES_BY_PRODUCT"] = "View Sales By Product";
    Choices["CREATE_DEPARTMENT"] = "Create New Department";
})(Choices || (Choices = {}));
async function main() {
    const database = new database_1.Database(utils_1.config);
    inquirer
        .prompt({
        name: "action",
        type: "list",
        message: "Choose an option",
        choices: [Choices.SALES_BY_PRODUCT, Choices.CREATE_DEPARTMENT],
    }).then((answer) => {
        switch (answer.action) {
            case Choices.SALES_BY_PRODUCT:
                console.log('stats');
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
function createDepartment(database) {
    inquirer.prompt([
        {
            name: "department_name",
            type: "input",
            message: "Item name",
            validate(answer) {
                return answer ? true : false;
            },
        },
        {
            name: "over_head_costs",
            type: "number",
            message: "Over head costs for department",
            validate(answer) {
                return utils_1.isInteger(answer);
            },
        },
    ]).then((answer) => {
        database.addDepartment(answer).then(() => {
            database.close();
        });
    });
}
main();
//# sourceMappingURL=supervisor.js.map