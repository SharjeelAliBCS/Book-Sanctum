
const { Pool, Client } = require("pg");
const pool = new Pool({
  user: "apqsznwhludbct",
  host: "ec2-35-172-85-250.compute-1.amazonaws.com",
  database: "d66prsg7g28r53",
  password: "161239fa8d874dbc62119103682c4b1e4bd64c313a1535ddcd98f406301a262f",
  port: "5432",
  ssl: true
});

function bookQueries(){

  this.searchBookByISBN = function (isbn, res){

    return new Promise (function(resolve, reject){
      pool.query("select book.isbn, book.title, book.description, book.price, book.page_count, book.stock, "+
                 "book.rating, book.rating_count, book.published_date, book.add_date, "+
                 "author.name as author, genre.name as genre, publisher.name as publisher "+
                 "from book "+
                 "inner join author on book.author_id = author.id "+
                 "inner join genre on book.genre_id = genre.id "+
                 "inner join publisher on book.publisher_id = publisher.id "+
                 "where book.isbn = $1;",
                 [isbn], (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
    
        resolve(result.rows);
      })
    });
  }

  this.addBookHistory = function (username, isbn, res){
    console.log("testing add book");
    return new Promise (function(resolve, reject){
      pool.query("insert into view_history values($1, $2, 0)",
                 [username, isbn], (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        console.log(result.rows) // brianc

        resolve(result.rows);
      })
    });
  }


}

module.exports = bookQueries;
