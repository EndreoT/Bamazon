import * as mysqlTypes from "../node_modules/@types/mysql";
interface ProductData {
    item_id: number;
    product_name: string;
    department_name: string;
    price: number;
    stock_quantity: number;
}
export declare class Database {
    connection: mysqlTypes.Connection;
    constructor(config: mysqlTypes.ConnectionConfig);
    getAllProducts(): Promise<ProductData[]>;
    printAllProducts(): Promise<void>;
    getProductById(productId: number): Promise<ProductData>;
    productExists(productId: number): Promise<boolean>;
    stockExists(productId: number, unitsToBuy: number): Promise<boolean>;
    updateStock(productId: number, unitsToBuy: number): Promise<{
        product?: ProductData;
        unitsToBuy?: number;
        totalPrice?: number;
    }>;
    close(): void;
}
export {};
