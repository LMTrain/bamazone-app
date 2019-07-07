# bamazone-app
This an app that functions like an Amazon storefront, using MySQL for storing, retrieving and updating stock inventories. The app will take in orders from customers and deplete stock from the store's inventory.  Also the app can track product sales across store's departments and then provide a summary of the highest-grossing departments in the store.


The application do the following:


#Customer View (Minimum Requirement)

Has a MySQL Database called bamazon.

The Table inside of that database is called products.

The products table has the following columns:

item_id (unique id for each product)

product_name (Name of product)

department_name

price (cost to customer)

stock_quantity (how much of the product is available in stores)

The app prompt users with two messages.

The first should ask them the ID of the product they would like to buy.

The second message should ask how many units of the product they would like to buy.



#Manager View

The Node application is called bamazonManager.js. Running this application

List a set of menu options:

View Products for Sale

View Low Inventory

Add to Inventory

Add New Product

If a manager selects View Products for Sale, the app would list every available item: the item IDs, names, prices, and quantities.

If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.

If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.


If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.



Github Repo: https://github.com/LMTrain/bamazone-app.git

Deployment Link: https://lmtrain.github.io/bamazone-app/

