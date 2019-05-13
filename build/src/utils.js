"use strict";
// Utility functions and interfaces for type checking
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'bamazon',
};
function isInteger(num) {
    if (!num) {
        return false;
    }
    return Number.isInteger(num) && num >= 0;
}
exports.isInteger = isInteger;
//# sourceMappingURL=utils.js.map