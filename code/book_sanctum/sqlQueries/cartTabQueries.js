
const { Pool, Client } = require("pg");
const pool = new Pool({
  user: "apqsznwhludbct",
  host: "ec2-35-172-85-250.compute-1.amazonaws.com",
  database: "d66prsg7g28r53",
  password: "161239fa8d874dbc62119103682c4b1e4bd64c313a1535ddcd98f406301a262f",
  port: "5432",
  ssl: true
});

function cartTabQueries(){

  this.checkoutOrder = function(username, card_number,address_id, res){
    console.log("date is " + " user is " + username);

    pool.query("insert into orders values(default, $1, default, $2, $3, 1)",
               [username, card_number, address_id], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      res.json(JSON.stringify(result.rows));
    })
  }

  this.addtoCart = function(username, isbn, quantity,res){
    console.log("username "+ username);
    console.log("isbn "+ isbn);
    console.log("quantity "+ quantity);

    pool.query("insert into cart values($1, $2, $3) "+
               "on conflict (username, isbn) do update "+
               "set quantity = $3 "+
               "where $1 = cart.username and $2 = cart.isbn;",
               [username, isbn, quantity], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      //console.log(result.rows) // brianc
      res.json(JSON.stringify(result.rows));
    })
  }

  this.getCartList = function(username, res){
    pool.query("select book.isbn,book.title,book.price,cart.quantity from book "+
               "inner join cart on book.isbn = cart.isbn "+
               "where cart.username = $1;",
               [username], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }

      res.json(JSON.stringify(result.rows));
    })
  }
}

module.exports = cartTabQueries;
