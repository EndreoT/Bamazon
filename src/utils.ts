// Utility functions and interfaces for type checking

export function isInteger(num: number): boolean {
  if (!num) {
    return false;
  }
  return Number.isInteger(num);
}

export interface ProductShape {
  product_name: string;
  department_name: string;
  price: number;
  stock_quantity: number;
}