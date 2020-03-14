//var csv is the CSV file with headers
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
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

function readJSON(paths){
  deleteData();
  data = {};

  for(let key in paths){

    const currData = fs.readFileSync(paths[key]);
    data[key] = JSON.parse(currData.toString());
    addDataDB(data,key);
  }


}


function addDataDB(data,key){

  console.log(data[key]);

  switch(key){
    case "book":
      addBookDB(data[key]);
      break;
    case "author":
      addAuthorDB(data[key]);
      break;
    case "genre":
      addGenreDB(data[key]);
      break;


  }
}

function deleteData(){

    pool.query('delete from book; delete from author; delete from genre;',
    (err, result) => {
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    //console.log(result.rows) // brianc

  })



}

function addBookDB(data){
  for(let i =0; i<data.length; i++){

    row = data[i];
      pool.query('insert into book values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);',
      [row.isbn13, row.title, row.description, row.author_id, row.genre_id, row.price, row.page_count, row.stock, row.rating, row.year,row.add_date],
      (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      //console.log(result.rows) // brianc

    })

  }

}

function addGenreDB(data){

  for(let i =0; i<data.length; i++){

    row = data[i];
      pool.query('insert into genre values($1, $2);',
      [row.genre_id, row.genre_name],
      (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      //console.log(result.rows) // brianc

    })

  }

}


function addAuthorDB(data){
  for(let i =0; i<data.length; i++){

    row = data[i];
      pool.query('insert into author values($1, $2);',
      [row.author_id, row.author_name],
      (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      //console.log(result.rows) // brianc

    })

  }

}


function getBookURL(isbn){

  var url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
  console.log(url);

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //console.log(typeof this.responseText);
      var data = JSON.parse(this.responseText);
      //console.log(data.pageCount);
      //console.log("parsed data for " + JSON.stringify(data));

    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}


var start = new Date().getTime();

paths = {
  "genre": "../data/Full_Data2/full_genres.json",
  "author": "../data/Full_Data2/full_authors.json",
  "book": "../data/Full_Data2/full_books.json",


}

val = readJSON(paths);
var end = new Date().getTime();
var time = end - start;
console.log("time it took was " + time + " miliseconds");
//console.log(val);
