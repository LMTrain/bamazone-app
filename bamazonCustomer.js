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
      name: "purchaseOrPrices",
      type: "list",
      message: "\n" + "Would you like to [Purchase] a Product or [View Prices] of Products?" + "\n" + "\n",
      choices: ["PURCHASE", "PRICES", "EXIT"]
    })
    .then(function(answer) {
      // based on their answer, either call the purchase or the prices functions
      if (answer.purchaseOrPrices === "PURCHASE") {
        purchaseItem();
      }
      else if(answer.purchaseOrPrices === "PRICES") {
        listItems();
      } else{
        connection.end();
      }
    });
}
function purchaseItem() {
  // query the database for all items being sold
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which product they want to buy

    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            var choiceArrayPrice = [];
            console.log("\n");
            console.log("**************************************************************");
            console.log("* These are the lists of products for sale with their prices *");
            console.log("**************************************************************");
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].product_name);
              choiceArrayPrice.push(" = $" + results[i].price);
              console.log("  " + [i+1] + ") " + choiceArray[i] + choiceArrayPrice[i]);                            
                                       
            }
            return choiceArray;                    
          },
          message: "\n" + "Enter the Id of the product you will like to buy?"
                    
        },
        {
          name: "buy",
          type: "input",
          message: "How many quantity of the product would you like to buy?",
          // validate: function(value) {
          //   if (isNaN(value) === false) {
          //     return true;
          //   }
          //   return false;
          // }
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        var chosenId;        
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name === answer.choice) {
            chosenItem = results[i];
            chosenId = i + 1;                     
          }
        }

        // determine if there are enough of the product in stock
        
        if (chosenItem.stock_quantity > parseInt(answer.buy)) {
          newStockQty = chosenItem.stock_quantity - parseInt(answer.buy)           
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
              console.log("****************************");
              console.log("*Order placed successfully!*");
              console.log("****************************");              
            }
          );          
          //Select all products and return the result object:
          connection.query(
            "SELECT * FROM products", function (err, result) {
            if (err) throw err;
            totalCost = result[chosenId - 1].price * parseInt(answer.buy)
            console.log("Product Name  : " + result[chosenId - 1].product_name);
            console.log("Product Price : $" + result[chosenId - 1].price);
            console.log("Qty Purchased : " + answer.buy);
            console.log("Total Cost    : $" + totalCost);
            console.log("*******************************");
            console.log("\n");               
            start();          
          });
        }
        else {
          // Insufficient quantity.
          console.log("\n");               
          console.log("***************************************************************************");
          console.log("*Your quantity is too high. We don't have that much in stock. Try again...*");
          console.log("***************************************************************************");
          console.log("\n");
          start();
        }
      });
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
        choiceArrayPrice.push(" = $" + results[i].price);
        console.log("  " + [i+1] + ") " + choiceArray[i] + choiceArrayPrice[i]); 
      }
      console.log("\n");
      start();
    
  });
}




















// function which prompts the user for what action they should take
// function start() {
//   inquirer
//     .prompt({
//       name: "postOrBid",
//       type: "list",
//       message: "Would you like to [POST] an auction or [BID] on an auction?",
//       choices: ["POST", "BID", "EXIT"]
//     })
//     .then(function(answer) {
//       // based on their answer, either call the bid or the post functions
//       if (answer.postOrBid === "POST") {
//         postAuction();
//       }
//       else if(answer.postOrBid === "BID") {
//         bidAuction();
//       } else{
//         connection.end();
//       }
//     });
// }

// function to handle posting new items up for auction
// function postAuction() {
  // prompt for info about the item being put up for auction
//   inquirer
//     .prompt([
//       {
//         name: "item",
//         type: "input",
//         message: "What is the item you would like to submit?"
//       },
//       {
//         name: "category",
//         type: "input",
//         message: "What category would you like to place your auction in?"
//       },
//       {
//         name: "startingBid",
//         type: "input",
//         message: "What would you like your starting bid to be?",
//         validate: function(value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         }
//       }
//     ])
//     .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
    //   connection.query(
    //     "INSERT INTO auctions SET ?",
    //     {
    //       item_name: answer.item,
    //       category: answer.category,
    //       starting_bid: answer.startingBid || 0,
    //       highest_bid: answer.startingBid || 0
    //     },
    //     function(err) {
    //       if (err) throw err;
    //       console.log("Your auction was created successfully!");
          // re-prompt the user for if they want to bid or post
//           start();
//         }
//       );
//     });
// }

// function bidAuction() {
  // query the database for all items being auctioned
//   connection.query("SELECT * FROM auctions", function(err, results) {
    // if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    // inquirer
    //   .prompt([
    //     {
    //       name: "choice",
    //       type: "rawlist",
    //       choices: function() {
    //         var choiceArray = [];
    //         for (var i = 0; i < results.length; i++) {
    //           choiceArray.push(results[i].item_name);
    //         }
    //         return choiceArray;
    //       },
    //       message: "What auction would you like to place a bid in?"
    //     },
    //     {
    //       name: "bid",
    //       type: "input",
    //       message: "How much would you like to bid?"
    //     }
    //   ])
    //   .then(function(answer) {
        // get the information of the chosen item
        // var chosenItem;
        // for (var i = 0; i < results.length; i++) {
        //   if (results[i].item_name === answer.choice) {
        //     chosenItem = results[i];
        //   }
        // }

       
        // determine if bid was high enough
        // if (chosenItem.highest_bid < parseInt(answer.bid)) {
          // bid was high enough, so update db, let the user know, and start over
        //   connection.query(
        //     "UPDATE auctions SET ? WHERE ?",
        //     [
        //       {
        //         highest_bid: answer.bid
        //       },
        //       {
        //         id: chosenItem.id
        //       }
        //     ],
        //     function(error) {
        //       if (error) throw err;
        //       console.log("Bid placed successfully!");
        //       start();
        //     }
        //   );
        // }
        // else {
          // bid wasn't high enough, so apologize and start over
//           console.log("Your bid was too low. Try again...");
//           start();
//         }
//       });
//   });
// }
