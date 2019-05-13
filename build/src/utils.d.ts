export declare const config: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
};
export declare function isInteger(num: number): boolean;
export interface ProductShape {
    product_name: string;
    department_name: string;
    price: number;
    stock_quantity: number;
    product_sales: number;
}
export interface SupervisorQueryShape {
    department_id: number;
    department_name: string;
    over_head_costs: number;
    product_sales: number;
    total_profit: number;
}
