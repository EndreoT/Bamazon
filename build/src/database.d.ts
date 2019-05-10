import * as mysqlTypes from "../node_modules/@types/mysql";
export declare class Database {
    connection: mysqlTypes.Connection;
    constructor(config: mysqlTypes.ConnectionConfig);
    getAllProducts(): Promise<mysqlTypes.QueryFunction[]>;
    printAllProducts(): Promise<any>;
    getProductById(productId: number): any;
    productExists(productId: number): Promise<boolean>;
    stockExists(productId: number, unitsToBuy: number): any;
    updateStock(productId: number, unitsToBuy: number): Promise<number>;
    close(): void;
}
