
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


  this.searchBooksByTitle = function(title, res){
    console.log(title);
    title = `%${title}%`;
    return new Promise (function(resolve, reject){
      pool.query("select book.isbn,book.title,book.price,author.name as author "+
                "from book inner join author on author.id = book.author_id "+
                 "where title ILIKE $1;",
                 //"author.name ILIKE $1 or "+
                 //"description ILIKE $1;",
                 [title], (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        //console.log(result.rows) // brianc
        //res.json(JSON.stringify(result.rows));
        resolve(result.rows);
      })
    });
  }

  this.filterBooksByGenre = function(title, res){
    console.log(title);
    title = `%${title}%`;
    pool.query("select name, count(*) "+
               "from (select * from book "+
               "where title ILIKE $1) as search "+
               "inner join genre on search.genre_id = genre.id "+
               "group by (name);",
               [title], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      //console.log(result.rows) // brianc
      res.json(JSON.stringify(result.rows));
    })
  }

  this.filterBooksByAuthor = function(title, res){
    console.log(title);
    title = `%${title}%`;
    pool.query("select name, count(*) "+
               "from (select * from book "+
               "where title ILIKE $1) as search "+
               "inner join author on search.author_id = author.id "+
               "group by (name);",
               [title], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }

      res.json(JSON.stringify(result.rows));
    })
  }

}

module.exports = searchQueries;
