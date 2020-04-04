
const { Pool, Client } = require("pg");
const pool = new Pool({
  user: "apqsznwhludbct",
  host: "ec2-35-172-85-250.compute-1.amazonaws.com",
  database: "d66prsg7g28r53",
  password: "161239fa8d874dbc62119103682c4b1e4bd64c313a1535ddcd98f406301a262f",
  port: "5432",
  ssl: true
});

function reportQueries(){
  //string char replacement:
  //https://www.tutorialrepublic.com/faq/how-to-replace-character-inside-a-string-in-javascript.php
  this.allRevenue = function(size, res){

    return new Promise (function(resolve, reject){
      pool.query("select order_date, book.isbn as name, round(price*quantity::numeric, 2) as transaction from orders "+
                 "inner join order_book on orders.order_number = order_book.order_number "+
                 "inner join book on book.isbn = order_book.isbn "+
                 "order by order_date desc limit $1;",
                 [size], (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        resolve(result.rows);
      })
    });
  }
  this.allExpenditures = function(size, res){

    return new Promise (function(resolve, reject){
      pool.query("select order_date, publisher.name as name, round(-price*quantity*0.2::numeric,2) as transaction from orders "+
                 "inner join order_book on orders.order_number = order_book.order_number "+
                 "inner join book on book.isbn = order_book.isbn "+
                 "inner join publisher on book.publisher_id = publisher.id "+
                 "order by order_date desc limit $1;",
                 [size], (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        resolve(result.rows);
      })
    });
  }

  this.allTypeSales = function(type, res){
    console.log(type);
    let queryStr = "select name, sum(quantity)"+
              "from order_book "+
              "inner join book on book.isbn = order_book.isbn "+
              "inner join X on book.X_id = X.id "+
              "group by X.name "+
              "order by sum desc limit 10;"
    queryStr = queryStr.replace(/X/g, type);
    pool.query(queryStr,
               [], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      console.log(result.rows);
      res.json(JSON.stringify(result.rows));
    })
  }

  this.allTypeSalesByPercent = function(type, res){
    //string char replacement:
    //https://www.tutorialrepublic.com/faq/how-to-replace-character-inside-a-string-in-javascript.php
    let queryStr = "select name, round(100*sum(quantity)/ "+
                  "(select sum(quantity) from order_book)::numeric, 2) as sold "+
                  "from order_book "+
                  "inner join book on book.isbn = order_book.isbn "+
                  "inner join X on book.X_id = X.id "+
                  "group by X.name;"
    queryStr = queryStr.replace(/X/g, type);
    pool.query(queryStr,
               [], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      res.json(JSON.stringify(result.rows));
    })
  }

  this.getAllSales = function(res){

    pool.query("select order_date, sum(price*quantity) as revenue, sum(price*quantity*-0.2) as expenditures from orders "+
              "inner join order_book on orders.order_number = order_book.order_number "+
              "inner join book on book.isbn = order_book.isbn "+
              "group by order_date order by order_date;",
               [], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      res.json(JSON.stringify(result.rows));
    })
  }
  this.getSalesSum = function(res){

    pool.query("select sum(quantity) from order_book "+
              "inner join book on book.isbn = order_book.isbn;",
               [], (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        res.json(JSON.stringify(result.rows));
      })
    }

    this.getRevenue = function (){

      return new Promise (function(resolve, reject){
        pool.query("select sum(quantity*price) as revenue, sum(quantity*price*0.2) as expenditures from order_book "+
                  "inner join book on book.isbn = order_book.isbn;",
                   [], (err, result) => {
          if (err) {
            return console.error('Error executing query', err.stack)
          }
          resolve(result.rows);
        })
      });
    }

}

module.exports = reportQueries;
