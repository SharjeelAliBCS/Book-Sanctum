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

function readCSV(path,out){
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

    data = modifyJSON(data);
    console.log("size of set is " + data.length);
    for(i in data){
      saveJSON(data[i], out[i]);
    }
    //addData(data);
    // handle end of CSV
  })
}

function getAuthors(data){

}
function modifyJSON(data){
  newData = [];
  authors = [];
  publishers = [];
  genres = [];

  for(i in data){
    delete data[i][""];
    delete data[i]["SAR"];



    renamePub = {"Penguin": "Penguin Group", "DC": "DC Comics","Dark Horse": "Dark Horse Comics","Harper": "Harper Collins","Image Comics": "Image Comics","Kensington": "Kensington"};
    for(key in renamePub){

      if(data[i]["publisher"].includes(key)){
        data[i]["publisher"] = renamePub[key]
      }
    }

    if(data[i]["generes"]=="none"){
      data[i]["generes"]="Staff picks"
    }

    author = createAuthor(authors, data[i]["author"]);
    id = author["data"]["author_id"];
    if(author["new"]){
      authors.push(author["data"]);
    }
    else{
      console.log(JSON.stringify(author["data"], null, 2));
    }

    data[i]["author_id"]=author["data"]["author_id"];
    data[i]["publisher_id"]='';
    data[i]["genre_id"]='';
    data[i]["stock"]=20;
    data[i]["add_date"]='';

    if(data[i]["ISBN"]!=''){
      newData.push(data[i]);
    //isbn = data[i]["ISBN"];
    //delete data[i]["ISBN"];
    //newData[isbn]=data[i];
    }

  }

  return {"books": newData,"authors": authors};
}

function createAuthor(authors, data){
  //console.log(data)
  let old = authors.filter((obj) => obj.fname == data);
  //

  if(old.length>0) {

    return {"new": false, "data": old[0]};
  }
  else{
    author = {};
    author["author_id"] = authors.length;
    author["fname"] = data;
    author["lname"] = '';
    return {"new": true, "data": author};

  }
}



function saveJSON(data,filename){

fs.writeFile(filename, JSON.stringify(data,null,2), 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});

}
function addData(data){

  for(let i =0; i<data.length; i++){
    //console.log(Object.keys(data[i]));
    //console.log(data[i].description);

    row = data[i];
      pool.query('insert into book values($1, $2, $3, $4, $5);',
      [row.isbn13, row.title, row.description, row.authors, row.categories], (err, result) => {
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



  api(result.rows);







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
var start = new Date().getTime();
getData();
val = readCSV("../../book-depository-dataset/google_books_1299.csv",{"books": "../data/Full_Data/full_books.json","authors": "../data/Full_Data/full_authors.json"});
var end = new Date().getTime();
var time = end - start;
console.log("time it took was " + time + " miliseconds");
//console.log(val);
