//var csv is the CSV file with headers
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
fs = require("fs");
var csv = require('csv-parser');
const { Pool, Client } = require("pg");

let bookQueries = require("../book_sanctum/sqlQueries/bookQueries");
let bookQueryInstance = new bookQueries();

const pool = new Pool({
  user: "apqsznwhludbct",
  host: "ec2-35-172-85-250.compute-1.amazonaws.com",
  database: "d66prsg7g28r53",
  password: "161239fa8d874dbc62119103682c4b1e4bd64c313a1535ddcd98f406301a262f",
  port: "5432",
  ssl: true
});

function readJSON(paths){

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
    case "publisher":
      addPublisherDB(data[key]);
  }
}

function deleteData(){

    pool.query('delete from book; delete from author; delete from genre; delete from publisher;',
    (err, result) => {
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    //console.log(result.rows) // brianc

  })



}

async function addBookDB(data){
  for(let i =0; i<data.length; i++){

    row = data[i];
    row["genre_id"] = await bookQueryInstance.getType(row.genre, 'genre').then(function(result){
      return result[0].id
    });
    row["author_id"] = await bookQueryInstance.getType(row.authors[0], 'author').then(function(result){
      return result[0].id
    });
    row["publisher_id"] = await bookQueryInstance.getType(row.publisher, 'publisher').then(function(result){
      return result[0].id
    });

    console.log(i)
    if(row.published_date.length>4){
      row["year"] = row.published_date.split('-')[0]
    }
    else{
      row["year"] = row.published_date
    }
    //console.log(row.published_date)

    row.isbn13, row.title, row.description, row.author_id, row.genre_id, row.publisher_id, row.price, row.page_count,row.year
    //console.log(row)

    a = await bookQueryInstance.addBook(row).then(function(result){
    });

  }

}

async function addGenreDB(data){

  for(let i =0; i<data.length; i++){
    row = data[i];
    console.log(i)
    a = await bookQueryInstance.addGenre(row.name, row.type).then(function(result){
      });
  }
}


async function addAuthorDB(data){
  for(let i =0; i<data.length; i++){

    row = data[i];
    console.log(i)
    a = await bookQueryInstance.addAuthor(row.name).then(function(result){
      });

  }

}

async function addPublisherDB(data){
  for(let i =0; i<data.length; i++){

    row = data[i];
    a = await bookQueryInstance.addPubCity(row.code, row.city).then(function(result){
    });
    a = await bookQueryInstance.addPubAddress(row.region, row.code, row.street, row.unit).then(function(result){
      return result[0].id
    });
    console.log(i)
    a = await bookQueryInstance.addPublisher(row.name, row.phone, row.email, a, row.rn, row.an).then(function(result){
    });

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
  //"genre": "data/Full_Data/full_genres.json",
  //"author": "data/Full_Data/full_authors.json",
  //"publisher": "data//new_pub.json",
  "book": "data/Full_Data/full_books.json",



}

val = readJSON(paths);
var end = new Date().getTime();
var time = end - start;
console.log("time it took was " + time + " miliseconds");
//console.log(val);
