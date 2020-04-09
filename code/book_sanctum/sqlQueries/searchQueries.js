
const { Pool, Client } = require("pg");
const pool = new Pool({
  user: "apqsznwhludbct",
  host: "ec2-35-172-85-250.compute-1.amazonaws.com",
  database: "d66prsg7g28r53",
  password: "161239fa8d874dbc62119103682c4b1e4bd64c313a1535ddcd98f406301a262f",
  port: "5432",
  ssl: true
});

function searchQueries(){

  this.getAllType = function(type, res){
    //string char replacement:
    //https://www.tutorialrepublic.com/faq/how-to-replace-character-inside-a-string-in-javascript.php
    let queryStr = "select name, id from X order by name;";
    queryStr = queryStr.replace(/X/g, type);
    pool.query(queryStr,
               [], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      res.json(JSON.stringify(result.rows));
    })
  }

  this.getPublisher = function(name, res){
    pool.query("select * from publisher "+
               "inner join address on publisher.address_id = address.id "+
               "where name=$1;",
              [name], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      //console.log(result.rows);
      res.json(JSON.stringify(result.rows[0]));
    });
  }

  this.getAllBooks = function(size, res){
    pool.query("select isbn from book where removed=false order by isbn limit $1",
              [size], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      //console.log(result.rows);
      res.json(JSON.stringify(result.rows));
    });
  }

  this.searchBooksByTitle = function(title, genre, res){
    console.log("search for "+ title + " and " + genre);

    genre = `%${genre}%`;
    return new Promise (function(resolve, reject){
      pool.query("select book.isbn,book.title,book.price,book.published_year, author.name as author, genre.name as genre_name from book "+
                "inner join author on author.id = book.author_id "+
                "inner join genre on genre.id = book.genre_id "+
                "WHERE genre.name like $2  and removed=false "+
                `and (length($1)= 0 or (similarity(book.title,$1) > 0.15 or similarity(author.name,$1) > 0.3) );`,
                 [title,genre], (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        resolve(result.rows);
      })
    });
  }

  this.advancedBookSearch = function(isbn, title, genre,author, year, publisher, isbn, res){

    genre = `%${genre}%`;
    isbn = `%${isbn}%`;
    return new Promise (function(resolve, reject){
      pool.query("select book.isbn,book.title,book.price,book.published_year, author.name as author, genre.name as genre_name from book "+
                "inner join author on author.id = book.author_id "+
                "inner join genre on genre.id = book.genre_id "+
                "inner join publisher on publisher.id = book.publisher_id "+
                "where genre.name like $2 and removed=false "+
                "and ($5 = 0 or book.published_year = $5)"+
                "and book.isbn like $6"+
                "and (length($1)= 0 or similarity(book.title,$1) > 0.15 ) "+
                "and (length($3) = 0 or  similarity(author.name,$3) > 0.15 ) "+
                "and (length($4) = 0 or  similarity(publisher.name,$4) > 0.15 ) "+
                ";",
                 [title,genre,author,publisher, year, isbn], (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        resolve(result.rows);
      })
    });
  }


}

module.exports = searchQueries;
