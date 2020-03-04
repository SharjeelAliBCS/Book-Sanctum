//var csv is the CSV file with headers
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
    console.log(dataString);
    addData(data);
    // handle end of CSV
  })
}

function addData(data){

  for(let i =0; i<data.length; i++){
    row = data[i];


      pool.query('insert into book values($1, $2, $3, $4);',
      [row.isbn, row.title, row.author, row.genre], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      //console.log(result.rows) // brianc

      })

  }

}

function getData(){
  pool.query('select * from book;', [], (err, result) => {
  if (err) {
    return console.error('Error executing query', err.stack)
  }


  })

}

val = readCSV("../data/book30-listing-test.csv");
console.log(val);
