// Utility functions and interfaces for type checking

export const config = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '1234',
  database: 'bamazon',
};

export function isInteger(num: number): boolean {
  if (!num) {
    return false;
  }
  return Number.isInteger(num) && num >= 0;
}

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
  total_profit:number;
}