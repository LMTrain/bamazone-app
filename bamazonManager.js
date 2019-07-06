var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the  sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Andover@iee62",
  database: "bamazon_DB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the listItems function after the connection is made to prompt the user to choose a product to buy by Id
  start();
});

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "inventoryOrProducts",
      type: "list",
      message: "\n" + "Would you like to [View Products] for Sale, [View Low] Inventory, [Add to] Inventory or [Add New] Product?" + "\n" + "\n",
      choices: ["VIEW PRODUCTS", "LOW INVENTORY", "ADD INVENTORY", "ADD PRODUCTS", "EXIT"]
    })
    .then(function(answer) {
      
      if (answer.inventoryOrProducts === "VIEW PRODUCTS") {
        listItems();
      }
      else if(answer.inventoryOrProducts === "LOW INVENTORY") {
        lowInvent();
      }
      else if(answer.inventoryOrProducts === "ADD INVENTORY") {
        addInvent();
      }
      else if(answer.inventoryOrProducts === "ADD PRODUCTS") {
        addProduct();
      } else{
        connection.end();
      }
    });
}

// function to handle posting new products
function addProduct() {
  // prompt for info about the new product
  inquirer
    .prompt([
      {
        name: "product",
        type: "input",
        message: "What is the product name you would like to submit?"
      },
      {
        name: "department",
        type: "input",
        message: "What is the department name of the product?"
      },
      {
        name: "price",
        type: "input",
        message: "What is the price of the product?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "quantity",
        type: "input",
        message: "What is the quantity of the product?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert the new product into the db with that info
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.product,
          department_name: answer.department,
          price: answer.price || 0,
          stock_quantity: answer.quantity || 0
        },
        function(err) {
          if (err) throw err;
          console.log("\n");
          console.log("**************************************************");
          console.log("*Product was added to the inventory successfully!*");
          console.log("**************************************************");        
          start();
        }
      );
    });
}

function listItems() {
  // query the database for all items being sold
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
      var choiceArray = [];
      var choiceArrayPrice = [];
      console.log("\n");
      console.log("**************************************************************");
      console.log("* These are the lists of products for sale with their prices *");
      console.log("**************************************************************");
      for (var i = 0; i < results.length; i++) {
        choiceArray.push(results[i].product_name);
        choiceArrayPrice.push(", Price = $" + results[i].price + ",  QTY = " + results[i].stock_quantity);
        console.log("  " + [i+1] + ") " + choiceArray[i] + choiceArrayPrice[i]); 
      }
      console.log("\n");
      start();
    
  });
}

function lowInvent() {
    // query the database for all items being sold
    connection.query("SELECT * FROM products WHERE stock_quantity <= 60", function(err, results) {
      if (err) throw err;
        var choiceArray = [];
        var choiceArrayPrice = [];
        var chosenId;
        console.log("\n");
        console.log("*************************************************************");
        console.log("* These are the lists of products that are low in inventory *");
        console.log("*************************************************************");
        for (var i = 0; i < results.length; i++) {
          choiceArray.push(results[i].product_name);
          choiceArrayPrice.push(", Price = $" + results[i].price + ",  QTY = " + results[i].stock_quantity);
          chosenId = results[i].item_id;
          console.log(" " + chosenId + ") " + choiceArray[i] + choiceArrayPrice[i]); 
        }
        console.log("\n");
        start();
      
    });
}

function addInvent() {
    // prompt for info about the product thats low in inventory
    connection.query("SELECT * FROM products WHERE stock_quantity <= 60", function(err, results) {
        if (err) throw err;
        // once you have the items, prompt the Manger for which product they want to add inventory
    
        inquirer
          .prompt([
            {
              name: "choice",
              type: "rawlist",
              choices: function() {
                var choiceArray = [];
                var choiceArrayPrice = [];
                var chosenId;
                console.log("\n");
                console.log("*************************************************************");
                console.log("* These are the lists of products that are low in inventory *");
                console.log("*************************************************************");
                for (var i = 0; i < results.length; i++) {
                    choiceArray.push(results[i].product_name);
                    choiceArrayPrice.push(", Price = $" + results[i].price + ",  QTY = " + results[i].stock_quantity);
                    chosenId = results[i].item_id;
                    console.log(" " + chosenId + ") " + choiceArray[i] + choiceArrayPrice[i]);                             
                                           
                }
                return choiceArray;                    
              },
              message: "\n" + "Enter the Id of the product you will like to add inventory?"
                        
            },
            {
              name: "add",
              type: "input",
              message: "How many quantity of the product would you like to add?",
              
            }
          ])
        .then(function(answer) {
            // get the information of the chosen item
            var chosenItem;
                    
            for (var i = 0; i < results.length; i++) {
              if (results[i].product_name === answer.choice) {
                chosenItem = results[i];
                                    
              }
            }
    
            // determine if there are enough of the product in stock
            
            // if (chosenItem.stock_quantity > parseInt(answer.add)) {
              newStockQty = chosenItem.stock_quantity + parseInt(answer.add)           
              // console.log("Stock quantity is less than input quatity")          
              
              connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                  {
                    stock_quantity: newStockQty
                  },
                  {
                    item_id: chosenId
                  }
                ],
                function(error) {
                  if (error) throw err;               
                  console.log("\n");               
                  console.log("******************************");
                  console.log("*Inventory adde successfully!*");
                  console.log("stock_quantity =" + newStockQty);
                  console.log("item_id =" + chosenId);
                  console.log("******************************");              
                }
              );          
              //Select all products and return the result object:
              connection.query(
                "SELECT * FROM products", function (err, result) {
                if (err) throw err;
                var choiceArray = [];
                var choiceArrayPrice = [];

                for (var i = 0; i < results.length; i++) {
                    choiceArray.push(results[i].product_name);
                    choiceArrayPrice.push(", Price = $" + results[i].price + ",  QTY = " + results[i].stock_quantity);
                    console.log("  " + [i+1] + ") " + choiceArray[i] + choiceArrayPrice[i]);
                }
               
                // console.log("Product Name  : " + result[chosenId - 1].product_name);
                // console.log("Product Price : $" + result[chosenId - 1].price);
                // console.log("Qty Purchased : " + answer.buy);
                // console.log("Total Cost    : $" + totalCost);
                // console.log("*******************************");
                // console.log("\n");               
                start();          
              });
            // }
            // else {
            //   // Insufficient quantity.
            //   console.log("\n");               
            //   console.log("***************************************************************************");
            //   console.log("*Your quantity is too high. We don't have that much in stock. Try again...*");
            //   console.log("***************************************************************************");
            //   console.log("\n");
            //   start();
            // }
        });
    });
}
    