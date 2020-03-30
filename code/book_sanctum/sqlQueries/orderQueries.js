
const { Pool, Client } = require("pg");
const pool = new Pool({
  user: "apqsznwhludbct",
  host: "ec2-35-172-85-250.compute-1.amazonaws.com",
  database: "d66prsg7g28r53",
  password: "161239fa8d874dbc62119103682c4b1e4bd64c313a1535ddcd98f406301a262f",
  port: "5432",
  ssl: true
});

function orderQueries(){

  this.getOrders = function(username, res){
    pool.query("select orders.order_date, book.isbn, book.title, author.name, book.price, order_book.quantity, order_book.order_number "+
              "from order_book "+
              "inner join orders on orders.order_number = order_book.order_number "+
              "inner join book on order_book.isbn = book.isbn "+
              "inner join author on book.author_id = author.id "+
              "where orders.username = $1 " +
              "order by order_book.order_number desc;",
              [username], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      //console.log(result.rows) // brianc
      res.json(JSON.stringify(result.rows));
    });
  }

}

module.exports = orderQueries;
