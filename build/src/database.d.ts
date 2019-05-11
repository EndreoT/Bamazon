import * as mysqlTypes from "../node_modules/@types/mysql";
import { ProductShape } from './utils';
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
    getProductById(productId: number): Promise<ProductData>;
    getAllProducts(): Promise<ProductData[]>;
    printAllProducts(): Promise<void>;
    printProducts(products: ProductData[]): void;
    productExists(productId: number): Promise<boolean>;
    stockExists(productId: number, unitsToBuy: number): Promise<boolean>;
    decreaseStock(productId: number, unitsToBuy: number): Promise<{
        product?: ProductData;
        unitsToBuy?: number;
        totalPrice?: number;
    }>;
    printLowStockProducts(): void;
    increaseInventory(itemId: number, incrementAmount: number): void;
    addNewProduct(product: ProductShape): void;
    close(): void;
}
export {};
