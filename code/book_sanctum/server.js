const express = require('express');
const https = require('https') //food2fork now requires https
let http = require('http')
let sqlQueries = require("./sqlQueries");

let sqlInstance = new sqlQueries();

const app = express();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();

const HTML_DIR = "/source/pages";
const CLIENT_DIR = "/source/client";

var bestSellers = ["yng_CwAAQBAJ", "7ep09WAFbDwC", "YbtNDwAAQBAJ","aVPNxmllbAUC", "Y41zAwAAQBAJ", "htv5QwJC7UkC","ZjzjoAEACAAJ","lqRdDwAAQBAJ","kDvsDQAAQBAJ","ddKwDwAAQBAJ"];
var recentlyViewed = ["wJWaDwAAQBAJ","XK2aDwAAQBAJ","uv4vqKYsyawC","ZrNzAwAAQBAJ","SjUjAwAAQBAJ","UQzntAEACAAJ","M8PjDAAAQBAJ","0ETIjwEACAAJ","1S1cvgEACAAJ","CsllDwAAQBAJ"];
var favGenres = ["Sci fi", "fantasy", "mystery","Games & Activities", "Fiction"];
var newlyAdded = ["Sci fi", "fantasy", "mystery","Games & Activities", "Fiction"];
var cart = ["Kb4bAQAAIAAJ", "gd7UCwAAQBAJ", "zGY1Sqjwf8kC"]

app.use(express.static(__dirname + CLIENT_DIR));
app.use(express.static(__dirname + HTML_DIR));

app.get('/', function(req, res, next){
  console.log("test html");
  res.sendFile(__dirname + HTML_DIR + '/HomePage.html');
});

app.get('/ListPage.html', function(req, res, next){
  console.log("list html");
  res.sendFile(__dirname + HTML_DIR + '/ListPage.html');
});

app.get('/genreData',function(req,res,next){
  sqlInstance.getGenres(res);
});

app.get('/bestSellersData',function(req,res,next){
  sqlInstance.searchBooksByTitle("river",res);
  //getBooksURL({"textInput": "self improvement"}, res, next,10);
});

app.get('/cart',function(req,res,next){
  console.log("in cart");
  sqlInstance.searchBooksByTitle("mountain",res);
  //getBooksURL({"textInput": "math"}, res, next,7);
});

app.get('/recentlyViewedData',function(req,res,next){
  console.log("recently viewed!")
  sqlInstance.searchBooksByTitle("earth",res);
  //getBooksURL({"textInput": "Halo"}, res, next,10);
});

app.get('/newlyAddedData',function(req,res,next){
  sqlInstance.getMostRecentBooks('3',res);
  //getBooksURL({"textInput": "James Dashner"}, res, next,3);
});

app.get('/genreList',function(req,res,next){
  sqlInstance.filterBooksByGenre(data["textInput"],res);
  //getBooksURL({"textInput": "James Dashner"}, res, next,3);
});

app.get('/authorList',function(req,res,next){
  sqlInstance.filterBooksByAuthor(data["textInput"],res);
  //getBooksURL({"textInput": "James Dashner"}, res, next,3);
});

app.get('/mainSearch', function (req, res, next) {

  data = req.query;
  sqlInstance.searchBooksByTitle(data["textInput"],res);
  //console.log(JSON.stringify(data))
  //bookData = getBooksURL(data,res,next,40);

});

app.get('/ISBNSearch', function (req, res, next) {

  data = req.query;
  sqlInstance.searchBookByISBN(Object.keys(data)[0], res);

});

app.listen(process.env.PORT || 3000)

function getGenres(){

}

/*
function getBooksURL(textInput, res, next,max){

  search = textInput["textInput"].replace(' ','+')
  console.log(search);

  var url = `https://www.googleapis.com/books/v1/volumes?q=${search}&maxResults=${max}`;
  console.log(url);
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(typeof this.responseText);
      var data = JSON.parse(this.responseText);
      res.json(JSON.stringify(data));
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

function getBookURL(isbn, res, next){

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
}*/
