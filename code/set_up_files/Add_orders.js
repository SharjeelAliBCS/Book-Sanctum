//var csv is the CSV file with headers

fs = require("fs");
var csv = require('csv-parser');
const { Pool, Client } = require("pg");

const pool = new Pool({
  user: "apqsznwhludbct",
  host: "ec2-35-172-85-250.compute-1.amazonaws.com",
  database: "d66prsg7g28r53",
  password: "161239fa8d874dbc62119103682c4b1e4bd64c313a1535ddcd98f406301a262f",
  port: "5432",
  ssl: true
});

function insertOrder(date){
  return new Promise (function(resolve, reject){
    pool.query("insert into orders values (default, 'test', $1,1111111111111111, 1027,1) returning order_number;",
               [date], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      resolve(result.rows);
    })
  });
}

function insert_order_book(order_number){
  return new Promise (function(resolve, reject){
    pool.query("insert into order_book(isbn, order_number, warehouse_id, quantity) "+
               "select isbn, $1, 1, floor(random() * 5 + 1)::int "+
               "from book "+
                "offset floor(random()*2699) limit 1;",
               [order_number], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
    })
  });

}

function add(){
  var now = new Date();
  var daysOfYear = [];
  for (var d = new Date(2020, 0, 1); d <= now; d.setDate(d.getDate() + 1)) {
    daysOfYear.push(new Date(d));
  }
  for(i = 0; i<daysOfYear.length; i++){
    date = daysOfYear[i]
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    date = yyyy+'-'+mm+'-'+dd;
    console.log(date);

    data = insertOrder(date).then(function(result){
      num = result[0].order_number;
      range = Math.floor(Math.random() * 5)+1;
      console.log(num+ " for range " + range);
      for(i =0; i<range; i++){
        bookData = insert_order_book(num).then(function(result){
          console.log("inserted for " + i);
        });
      }
    });
  }
  console.log( );


}
add();

//console.log(val);
//for run in {1..100}; do node Add_info.js; sleep 1; done
