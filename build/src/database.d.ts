import * as mysqlTypes from "../node_modules/@types/mysql";
import { ProductShape } from './utils';
interface ProductData {
    item_id: number;
    product_name: string;
    department_name: string;
    price: number;
    stock_quantity: number;
    product_sales: number;
}
export declare class Database {
    connection: mysqlTypes.Connection;
    constructor(config: mysqlTypes.ConnectionConfig);
    getProductById(productId: number): Promise<ProductData>;
    getAllProducts(): Promise<ProductData[]>;
    printAllProducts(): Promise<void>;
    printProducts(products: ProductData[]): Promise<void>;
    productExists(productId: number): Promise<boolean>;
    stockExists(productId: number, unitsToBuy: number): Promise<boolean>;
    decreaseStock(productId: number, unitsToBuy: number): Promise<{
        product?: ProductData;
        unitsToBuy?: number;
        totalPrice?: number;
    }>;
    printLowStockProducts(): Promise<void>;
    increaseInventory(itemId: number, amountToAdd: number): Promise<void>;
    addNewProduct(product: ProductShape): Promise<void>;
    printStatsForSupervisor(): Promise<void>;
    close(): void;
}
export {};
