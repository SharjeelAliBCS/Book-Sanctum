
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

  this.allStock = function(start, end, res){

    pool.query("select date, sum(amount) over (order by date) from "+
              "(select date, sum(amount) as amount from transactions "+
              "where date >=$1 and date<=$2 "+
              "group by date ) as daily;",
               [start, end], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      res.json(JSON.stringify(result.rows));
    })
  }

  this.addTransaction = function(name, amount, date,  res){

    pool.query("insert into transaction values (default, $1, $2, $3);",
               [name, amount, date], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      res.json(JSON.stringify(result.rows));
    })
  }

  this.allTransactions = function(start, end, res){
    console.log("test");
    pool.query("select * from transactions "+
               "where date >=$1 and date<=$2;",
               [start, end], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      res.json(JSON.stringify(result.rows));
    })
  }

  this.allTransactionsType = function(start,end, type, res){
    console.log(start + ", " + end+ ", "+ type)
    return new Promise (function(resolve, reject){
      pool.query("select distinct(transactions.date), daily.sum as amount from transactions "+
                "left outer join "+
                "(select date, sum(amount) from transactions "+
                `where type ${type} 'book sale'`+
                "group by date) as daily "+
                "on daily.date = transactions.date "+
                "where transactions.date >=$1 and transactions.date<=$2 "+
                "order by date "+
                ";",
                 [start, end], (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        resolve(result.rows);
      })
    });
  }

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
      pool.query("select order_date, publisher.name as name, round(-price*quantity*sale_percent::numeric,2) as transaction from orders "+
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

  this.allTypeSales = function(start, end, type, res){
    console.log(type);
    let queryStr = "select X.name, sum(quantity)"+
                    "from order_book "+
                    "inner join book on book.isbn = order_book.isbn "+
                    "inner join orders on orders.order_number = order_book.order_number "+
                    "inner join X on book.X_id = X.id "+
                    "where orders.order_date >=$1 and orders.order_date<=$2 "+
                    "group by X.name "+
                    "order by sum desc limit 10;"
    queryStr = queryStr.replace(/X/g, type);
    pool.query(queryStr,
               [start, end], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      console.log(result.rows);
      res.json(JSON.stringify(result.rows));
    })
  }

  this.allTypeSalesByPercent = function(start, end, type, res){
    //string char replacement:
    //https://www.tutorialrepublic.com/faq/how-to-replace-character-inside-a-string-in-javascript.php
    let queryStr = "select name, round(100*sum(quantity)/ "+
                  "(select sum(quantity) from order_book "+
                  "inner join orders on orders.order_number = order_book.order_number "+
                  "where orders.order_date >=$1 and orders.order_date<=$2 "+
                  ")::numeric, 2)  as sold "+
                  "from order_book "+
                  "inner join book on book.isbn = order_book.isbn "+
                  "inner join X on book.X_id = X.id "+
                  "inner join orders on orders.order_number = order_book.order_number "+
                  "where orders.order_date >=$1 and orders.order_date<=$2 "+
                  "group by X.name;"
    queryStr = queryStr.replace(/X/g, type);
    pool.query(queryStr,
               [start, end], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      res.json(JSON.stringify(result.rows));
    })
  }

  this.getAllSales = function(res){

    pool.query("select order_date, sum(price*quantity) as revenue, sum(price*quantity*-*sale_percent) as expenditures from orders "+
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

    this.getSalesNumbers = function (start, end, res){

    pool.query("select "+
            	"count(case when type='book sale' then 1 else 0 end) as sold, "+
              "sum(amount) as profit, "+
              "sum(case when amount > 0 then amount else 0 end) as sales, "+
              "sum(case when amount < 0 then amount else 0 end) as expenditures, "+
              "sum(case when type ='publisher fees' then -amount else 0 end) as publisher_fees, "+
              "sum(case when type = 'other' then -amount else 0 end) as other, "+
              "sum(case when type = 'restock' then -amount else 0 end) as restock "+
              "from transactions "+
              "where date >=$1 and date<=$2;",
               [start, end], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      res.json(JSON.stringify(result.rows));
    })
  }
}

module.exports = reportQueries;
