
const { Pool, Client } = require("pg");
const pool = new Pool({
  user: "apqsznwhludbct",
  host: "ec2-35-172-85-250.compute-1.amazonaws.com",
  database: "d66prsg7g28r53",
  password: "161239fa8d874dbc62119103682c4b1e4bd64c313a1535ddcd98f406301a262f",
  port: "5432",
  ssl: true
});

function clientHomeQueries(){

  this.getMostSoldBooks = function(res){
    pool.query("select book.isbn, book.title, book.price, author.name as author from "+
              "(select isbn, sum(quantity) as sales from order_book "+
              "group by(isbn) ) as sold "+
              "inner join book on sold.isbn = book.isbn "+
              "inner join author on book.author_id = author.id "+
              "order by sales desc "+
              "limit 10;",
               [], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      res.json(JSON.stringify(result.rows));
    })
  }

  this.getViewedBooks = function(username, res){
    console.log(username + " viewes");
    pool.query("select book.isbn, book.title, book.price, author.name as author from book "+
              "inner join view_history on book.isbn = view_history.isbn "+
              "inner join author on book.author_id = author.id  "+
              "where view_history.username = $1 "+
               "order by view_history.rank;",
               [username], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      res.json(JSON.stringify(result.rows));
    })
  }

  this.searchBookByISBN = function(isbn, res){

    pool.query("select book.isbn, book.title, book.description, book.price, book.page_count, "+
	             "book.published_year, book.add_date, "+
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

      res.json(JSON.stringify(result.rows[0]));
    })
  }

  this.getMostRecentBooks = function(limit, res){

    pool.query("select book.isbn, book.title, book.price,author.name "+
               "from book left join author on author.id = book.author_id "+
               "order by book.add_date DESC "+
               "limit $1;",
    [limit], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }

      res.json(JSON.stringify(result.rows));
    })

  }
}

module.exports = clientHomeQueries;
