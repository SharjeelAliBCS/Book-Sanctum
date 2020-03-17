//var csv is the CSV file with headers
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
fs = require("fs");
var csv = require('csv-parser');
const { Pool, Client } = require("pg");
let http = require('http')

const port = 3000;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

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

function getBookURL(isbn, res, next){
  //https://www.googleapis.com/books/v1/volumes?q=isbn:9780553573428

  var url = `https://www.googleapis.com/books/v1/volumes/${isbn}`;
  console.log(url);
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(typeof this.responseText);
      var data = JSON.parse(this.responseText);
      console.log("parsed data for " + JSON.stringify(data));
      res.json(JSON.stringify(data));
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

function compare( a, b ) {
  if ( a.name < b.name ){
    return -1;
  }
  if ( a.name > b.name ){
    return 1;
  }
  return 0;
}



function findPub(publishers, publisher){

  let old = publishers.filter((obj) => obj.name.replace(' ','').toUpperCase().includes(publisher));

  if(old.length>0){
    found = true;
    publisher = old[0]["name"];

    return {"found": true, "data": publisher};
  }
  return {"found": false, "data": null};

}
function renamePublisher(publishers, data, i){
  publisher = data[i]["publisher"];

  if(publishers.length>0){

    returnVal = 0;

    if(publisher.includes('/')){
      contain = publisher.split('/');

      for(c in contain){
        val = contain[c].split(' ')[0].toUpperCase();
        returnVal = findPub(publishers, val);
        if(returnVal["found"]){
          break;
        }
      }
    }

    else{
      contain = publisher.split(' ')[0].toUpperCase();
      returnVal = findPub(publishers, contain);

    }
    if(returnVal["found"]){
      publisher = returnVal["data"];
      return publisher;
    }
  }

  renamePub = {"ROC": "ROC", "Avon": "Avon","Ballantine" : "Ballantine Books","Ballentine" : "Ballantine Books",
    "Onyx": "Onyx Group", "Disney": "Disney-Hyperion",
    "Scholastic": "Scholastic","Penguin": "Penguin Group", "DC": "DC Comics","Dark Horse": "Dark Horse Comics","Harper": "Harper Collins","Image Comics": "Image Comics","Kensington": "Kensington"};
  for(key in renamePub){

    if(publisher.includes(key)){
      publisher = renamePub[key]
    }
  }
  return publisher;

}

function renameGeneres(data){

  renameG = {"children": "children","classic": "classics","young": "young adult","science-fiction": "sci-fi","historical": "historical","romance": "romance","fantasy":"fantasy","christian":"christian",
            "cómics": "comics","dystopia": "dystopian","graphic":"graphic-novels","magical":"fantasy","mangá":"manga","paranormal":"horror","scifi":"sci-fi","school":"education","book-club":"fiction",
             "house-of-night":"fiction","james-pat":"nonfiction","jodi-p":"nonfiction","john-g":"nonfiction","nicholas":"nonfiction","non-fiction":"nonfiction","nora-r":"fiction","paulo-coelh":"fiction",
           "pretty-little-liars":"fiction","realistic-fiction":"fiction","star-wars":"sci-fi","stephen-king":"fiction","true-crime":"mystery","time-travel":"sci-fi","vampires":"fantasy","warriors":"fantasy",
          "ya":"fiction","zombies": "dystopian","chick-lit":"fiction","china":"international","india":"international","japan":"international","lee-child":"fiction","series":"fiction","agatha-":"mystery"};
  renameType = ["sports","cookbooks","design","education","leadership","nonfiction",];
  genreType = 'fiction';
  for( var i = data.length-1; i--;){
    if ( data[i] === 'fiction'){
      genreType = "fiction";
       data.splice(i, 1);
     }
     else if(data[i].split(' ').join('').replace('-','')==="nonfiction"){
       genreType="nonfiction";
       data.splice(i, 1);
     }

  }



  if(data.length==0){
    data.push(genreType);
  }

  genre = data[0];

  for(key in renameG){

    if(genre.includes(key)){
      genre = renameG[key]
      //console.log("found it, now "+genre)
    }

  }

  if(renameType.includes(genre)){
    genreType="nonfiction"
  }

  return {"type": genreType, "generes": genre};
}

function modifyJSON(data){
  newData = [];
  authors = [];
  publishers = [];
  generes = [];
  index = 0;
  for(i in data){
    delete data[i][""];
    delete data[i]["SAR"];

    if(data[i]["description"]=="REMOVE" || data[i]["rating"]==-1){
      continue;
    }

    if("publishers" in data[i]){
      data[i]["publisher"] = data[i]["publishers"][0];
      delete data[i]["publishers"];
    }
    returnVal = renameGeneres(data[i]["generes"]);
    //console.log(returnVal);
    data[i]["genre"] = returnVal["generes"];
    genreType = returnVal["type"];
    delete data[i]["generes"];

    authorText = data[i]["authors"][0];

    data[i]["publisher"] = renamePublisher(publishers, data,i);

    author = createAuthor(authors, authorText);
    id = author["data"]["id"];
    if(author["new"]){
      authors.push(author["data"]);
    }
    data[i]["author_id"]=author["data"]["id"];

    genre = createGenre(generes, data[i]["genre"],genreType);
    id = genre["data"]["id"];
    if(genre["new"]){
      generes.push(genre["data"]);
    }
    data[i]["genre_id"]=genre["data"]["id"];

    publisher = createPublisher(publishers, data[i]["publisher"]);
    id = publisher["data"]["id"];
    if(publisher["new"]){
      publishers.push(publisher["data"]);

    }
    data[i]["publisher_id"]=publisher["data"]["id"];

    data[i]["index"] = index;
    data[i]["price"] = createPrice();
    index++;

    newData.push(data[i]);

  }
  //generes.sort( compare );
  return {
    "books": newData,
    "authors": authors,
    "genres": generes,
    "publishers": publishers
  };
}
function createPrice(){
  prices = [9.99, 11.99, 19.99, 22.99, 4.99, 34.99, 24.99,14.99, 17.39];
  //return prices[Math.floor(Math.random()*prices.length)];
  option = Math.floor(Math.random()*11);
  randomNum = 0;
  min = 0;
  max = 0;

  if(option==0){
      min = 4;
      max = 5;
  }
  else if(option>0  && option <=4){
    min = 5;
    max = 10;
  }

  else if(option>4  && option <=9){
    min = 10;
    max = 20;
  }

  else if(option>9){
    min = 20;
    max = 40;
  }

  randomnum = Math.random() < 0.5 ? ((1-Math.random()) * (max-min) + min) : (Math.random() * (max-min) + min);
  randomnum = Math.round((randomnum + Number.EPSILON) * 100) / 100
  console.log(`${option}: ${randomnum}`);
  return randomnum;
}
function createAuthor(authors, data){
  //console.log(data)
  let old = authors.filter((obj) => obj.name == data);
  //

  if(old.length>0) {

    return {"new": false, "data": old[0]};
  }
  else{
    author = {};
    author["id"] = authors.length;
    author["name"] = data;
    //author["lname"] = '';

    return {"new": true, "data": author};

  }
}

function createPublisher(publishers, data){

  let old = publishers.filter((obj) => obj.name == data);

  if(old.length>0) {

    return {"new": false, "data": old[0]};
  }
  else{
    publisher = {};

    publisher["id"] = publishers.length;
    publisher["name"] = data;
    publisher["address"] = '',
    publisher["phone"] = '',
    publisher["email"] = data.split(' ').join('').replace(',','.')+"@worldpublishers.com"
    publisher["bank_id"] = '';
    return {"new": true, "data": publisher};

  }
}

function createGenre(generes, data,genreType){
  //console.log(data)
  let old = generes.filter((obj) => obj.name == data);
  //

  if(old.length>0) {

    return {"new": false, "data": old[0]};
  }
  else{
    genre = {};
    genre["id"] = generes.length;
    genre["name"] = data;
    genre["type"] = genreType;
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

paths = {"books": "../data/Full_Data/full_books.json",
"authors": "../data/Full_Data/full_authors.json",
"genres": "../data/Full_Data/full_genres.json",
"publishers": "../data/Full_Data/full_publishers.json"}
//val = readCSV("../../book-depository-dataset/google_books_1299.csv",paths);
readJSON("../data/Full_Data2/full_info.json",paths);
var end = new Date().getTime();
var time = end - start;
console.log("time it took was " + time + " miliseconds");
//console.log(val);
