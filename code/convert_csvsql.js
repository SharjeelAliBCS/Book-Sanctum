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

function readJSON(path,out){
  data = {};
    const currData = fs.readFileSync(path);
    data = JSON.parse(currData.toString());
    data = modifyJSON(data);
    console.log("found lines: "+data.length)
    for(i in data){
      saveJSON(data[i], out[i]);
    }
}




function getAuthors(data){

}
function modifyJSON(data){
  newData = [];
  authors = [];
  publishers = [];
  generes = [];

  for(i in data){
    delete data[i][""];
    delete data[i]["SAR"];
    delete data[i]["isbn10"];

    /*if(data[i]["subjects"].length==0){

      data[i]["subjects"] = data[i]["tags"];
      console.log(data[i]["subjects"])
    }*/
    data[i]["subjects"] = data[i]["tags"];
    delete data[i]["tags"]
    if(data[i]["subjects"]==null){
      continue;
    }

    if("publishers" in data[i]){
      data[i]["publisher"] = data[i]["publishers"][0];
      delete data[i]["publishers"];
    }
    if("authors" in data[i]){
      data[i]["author"] = data[i]["authors"][0];
      delete data[i]["authors"];
    }
    if("subjects" in data[i]){
      data[i]["generes"] = data[i]["subjects"][0];
      delete data[i]["subjects"];
    }


    renamePub = {"Penguin": "Penguin Group", "DC": "DC Comics","Dark Horse": "Dark Horse Comics","Harper": "Harper Collins","Image Comics": "Image Comics","Kensington": "Kensington"};
    for(key in renamePub){

      if(data[i]["publisher"].includes(key)){
        data[i]["publisher"] = renamePub[key]
      }
    }

    if(data[i]["generes"]=="none"){
      data[i]["generes"]="Staff picks"
    }

    //console.log(data[i]["generes"])
    data[i]["generes"] = data[i]["generes"].split(' --')[0].replace('-',' ');

    data[i]["price"] = createPrice();

    author = createAuthor(authors, data[i]["author"]);
    id = author["data"]["author_id"];
    if(author["new"]){
      authors.push(author["data"]);
    }
    data[i]["author_id"]=author["data"]["author_id"];


    genre = createGenre(generes, data[i]["generes"]);
    id = genre["data"]["genre_id"];
    if(genre["new"]){
      generes.push(genre["data"]);
    }
    else{
      console.log(JSON.stringify(genre["data"], null, 2));
    }
    data[i]["genre_id"]=genre["data"]["genre_id"];

    data[i]["publisher_id"]='';
    data[i]["stock"]=20;
    data[i]["add_date"]='';

    if(data[i]["ISBN"]!=''){
      newData.push(data[i]);
    //isbn = data[i]["ISBN"];
    //delete data[i]["ISBN"];
    //newData[isbn]=data[i];
    }

  }

  return {"books": newData,"authors": authors,"genres": generes};
}
function createPrice(){
  prices = [9.99, 11.99, 19.99, 22.99, 4.99, 34.99, 24.99];
  return prices[Math.floor(Math.random()*prices.length)];

}
function createAuthor(authors, data){
  //console.log(data)
  let old = authors.filter((obj) => obj.author_name == data);
  //

  if(old.length>0) {

    return {"new": false, "data": old[0]};
  }
  else{
    author = {};
    author["author_id"] = authors.length;
    author["author_name"] = data;
    //author["lname"] = '';

    return {"new": true, "data": author};

  }
}

function createPublisher(publishers, data){
  //console.log(data)
  let old = publishers.filter((obj) => obj.fname == data);
  //

  if(old.length>0) {

    return {"new": false, "data": old[0]};
  }
  else{
    publisher = {};
    author["publisher_id"] = authors.length;
    author["publisher_name"] = data;
    return {"new": true, "data": publisher};

  }
}

function createGenre(generes, data){
  //console.log(data)
  let old = generes.filter((obj) => obj.genre_name == data);
  //

  if(old.length>0) {

    return {"new": false, "data": old[0]};
  }
  else{
    genre = {};
    genre["genre_id"] = generes.length;
    genre["genre_name"] = data;
    return {"new": true, "data": genre};
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

var start = new Date().getTime();

paths = {"books": "../data/Full_Data2/full_books.json",
"authors": "../data/Full_Data2/full_authors.json",
"genres": "../data/Full_Data2/full_genres.json"}
//val = readCSV("../../book-depository-dataset/google_books_1299.csv",paths);
readJSON("../data/CleanedData.json",paths);
var end = new Date().getTime();
var time = end - start;
console.log("time it took was " + time + " miliseconds");
//console.log(val);
