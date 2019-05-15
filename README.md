# Bamazon

## Description
Node.js command line interface simulating a "Amazon" like store.

## Motivation 
This project can be a starting point for a product store backend with CRUD operations implemented. 

## Results
There are three levels of interaction with the Bamazon store: customers, managers, and supervisors, all of which use the command line. Bamazon uses SQL to communicate to a MySQL database, which stores a products table and a departments table. The node.js mysql package allows communication between node and the database.

## Available actions
* Customers choose which product and how much to purchase, and view a purchase receipt.
* Managers view all products, low stock products, increase inventory for existing produts, and add new products.
* Supervisors view department information and add new departments.

## Installation
You will need a MySQL database. One option is https://dev.mysql.com/downloads/
```
git clone <Word-Guess-Game url>
cd path/to/Word-Guess-Game
(You may have to run 'npx gts init')
npm install
```
Next, add and execute the schema SQL files (MySQL Workbench is handy for this task), then do the same with the seeds SQL files to create a database for sandbox use.

## Compile typescript to javascript
```
npm run compile
```

## Run 
```
cd build/src
node <filename>
```
Where filename is from one of the three following files in build/src:
```
bamazonCustomer.js
bamazonManager.js
supervisor.js
```

## Examples

### bamazonCustomer.js
![bamazonCustomer.js](./assets/gifs/customer-demo.gif)

### bamazonManager.js
![bamazonManager.js](./assets/gifs/manager-demo.gif)

### supervisor.js
![supervisor.js](./assets/gifs/supervisor-demo.gif)
