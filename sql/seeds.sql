
USE bamazon;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
("Car battery", "automotive parts", 78.99, 23),
("A Game of Thrones: A Song of Ice and Fire, Book 1", "books", 23.89, 123),
("The Very Hungry Caterpillar", "books", 8.91, 35),
("High heels", "clothing", 34.98, 234),
("Top hat", "clothing", 23.59, 10000000),
("Microwave", "appliances", 45, 100),
("Crock pot", "appliances", 75.89, 340),
("Minecraft CD", "Games", 6.99, 831),
("iPhone", "electronics", 1000.00, 10000), 
("Dive Watch", "electronics", 250.99, 53);



SELECT * FROM products;