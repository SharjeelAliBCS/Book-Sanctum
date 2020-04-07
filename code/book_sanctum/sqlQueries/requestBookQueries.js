
const { Pool, Client } = require("pg");
const pool = new Pool({
  user: "apqsznwhludbct",
  host: "ec2-35-172-85-250.compute-1.amazonaws.com",
  database: "d66prsg7g28r53",
  password: "161239fa8d874dbc62119103682c4b1e4bd64c313a1535ddcd98f406301a262f",
  port: "5432",
  ssl: true
});

function requestQueries(){

  this.addDescision = function(username, num, desc, res){
    pool.query("insert into admin_decides values ($2, $1, $3, default)",
              [username, num, desc], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      //console.log(result.rows) // brianc
      res.json(JSON.stringify(result.rows));
    });
  }

  this.addRequest = function(username, isbn, title, res){
    pool.query("insert into request_book values (default, $1, $2, $3, default)",
              [username, isbn, title], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      //console.log(result.rows) // brianc
      res.json(JSON.stringify(result.rows));
    });
  }

  this.getClientRequests = function(username, res){
    pool.query("select  request_book.request_number, username, request_isbn as isbn, "+
               "request_title as title, request_book.date  as req_date, "+
               "admin_decides.date as desc_date, decision "+
               "from request_book "+
               "left outer join admin_decides on admin_decides.request_number = request_book.request_number "+
               "where username = $1 "+
               "order by request_book.request_number desc",
              [username], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      //console.log(result.rows) // brianc
      res.json(JSON.stringify(result.rows));
    });
  }

  this.getRequests = function(res){
    pool.query("select  request_book.request_number, username, request_isbn as isbn, "+
               "request_title as title, request_book.date  as req_date, "+
               "admin_decides.date as desc_date, last_name, decision "+
               "from request_book "+
               "left outer join admin_decides on admin_decides.request_number = request_book.request_number "+
               "left outer join admin on admin.email = admin_decides.email "+
               "order by request_book.request_number desc",
              [], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      //console.log(result.rows) // brianc
      res.json(JSON.stringify(result.rows));
    });
  }

}

module.exports = requestQueries;
