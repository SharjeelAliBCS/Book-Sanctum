//var csv is the CSV file with headers
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
fs = require("fs");
var csv = require('csv-parser');
const { Pool, Client } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "book_sanctum",
  password: "2552",
  port: "5432"
});

function readCSV(path){
  data = [];
  fs.createReadStream(path)
  .on('error', (err) => {
    console.log("error "+ err);
  })

  .pipe(csv())
  .on('data', (row) => {
    data.push(row)

  })

  .on('end', () => {
    console.log("data loaded");
    dataString =  JSON.stringify(data[3]);
    console.log("size of set is " + data.length);
    addData(data);
    // handle end of CSV
  })
}

function addData(data){

  for(let i =0; i<data.length; i++){
    row = data[i];
      pool.query('insert into book values($1, $2, $3, $4);',
      [row.isbn13, row.title, row.authors, row.categories], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      //console.log(result.rows) // brianc

      })

  }

}

function getData(){

  pool.query('select isbn from book order by isbn desc fetch first 100 rows only;', [], (err, result) => {
  if (err) {
    return console.error('Error executing query', err.stack)
  }
  //console.log(result.rows);


  var start = new Date().getTime();
  api(result.rows);
  var end = new Date().getTime();
  var time = end - start;

  console.log("time it took was " + time + " miliseconds");




  })

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

function api(data){
  for(i in data){
    console.log(data[i].isbn);
    getBookURL(data[i].isbn);
  }

}

getData();
//val = readCSV("../../book-depository-dataset/dataset.csv");
//console.log(val);
