const express = require('express');
const https = require('https') //food2fork now requires https
let http = require('http')
const app = express();
const port = 3000;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();

const HTML_DIR = "/source/pages";
const CLIENT_DIR = "/source/client";

var genres = ["Sci fi", "fantasy", "mystery","Games & Activities", "Fiction"];
var bestSellers = ["yng_CwAAQBAJ", "7ep09WAFbDwC", "YbtNDwAAQBAJ","aVPNxmllbAUC", "Y41zAwAAQBAJ", "htv5QwJC7UkC","ZjzjoAEACAAJ","lqRdDwAAQBAJ","kDvsDQAAQBAJ","ddKwDwAAQBAJ"];
var recentlyViewed = ["wJWaDwAAQBAJ","XK2aDwAAQBAJ","uv4vqKYsyawC","ZrNzAwAAQBAJ","SjUjAwAAQBAJ","UQzntAEACAAJ","M8PjDAAAQBAJ","0ETIjwEACAAJ","1S1cvgEACAAJ","CsllDwAAQBAJ"];
var favGenres = ["Sci fi", "fantasy", "mystery","Games & Activities", "Fiction"];
var newlyAdded = ["Sci fi", "fantasy", "mystery","Games & Activities", "Fiction"];

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
  res.json(JSON.stringify(genres));
});

app.get('/bestSellersData',function(req,res,next){
  getBooksURL({"textInput": "self improvement"}, res, next,10);
});

app.get('/recentlyViewedData',function(req,res,next){
  console.log("recently viewed!")
  getBooksURL({"textInput": "Halo"}, res, next,10);
});

app.get('/newlyAddedData',function(req,res,next){
  getBooksURL({"textInput": "stuff"}, res, next,10);
});

app.get('/mainSearch', function (req, res, next) {

  data = req.query;

  console.log(JSON.stringify(data))
  bookData = getBooksURL(data,res,next,40);

});

app.get('/ISBNSearch', function (req, res, next) {

  data = req.query;

  //console.log(JSON.stringify(data));
  bookData = getBookURL(Object.keys(data)[0],res,next);


});

/*
app.use('*', function (req, res, next) {
  console.log('-------------------------------')
  console.log('req.path: ', req.path)
  console.log('serving:' + __dirname + CLIENT_DIR + req.path)

  if (req.method == "GET") {
    let qString = req.query


    //console.log("q = ", JSON.stringify(querystring))
    if (qString != undefined && qString.name) {
    }
    else {
    }

  }


})*/

//use morgan logger to keep request log files
//app.use(logger('dev'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

function getGenres(){

}

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
}





/*
function getBooksURL(textInput, res, next) {
  console.log("in url");

  //You need to provide an appid with your request.
  //Many API services now require that clients register for an app id.

  const options = {
    host: 'https://www.googleapis.com',
    path: `/books/v1/volumes?q=isbn:1681196638`
  }
  https.request(options, function (apiResponse) {
    //parseData(apiResponse, res)
    console.log("got smoething");
    parseData(apiResponse, res, next, textInput);

  }).end()
}

function parseData(apiResponse, res, next, textInput) {
  let apiData = ''
  apiResponse.on('data', function (chunk) {
    apiData += chunk
  })
  apiResponse.on('end', function () {
    //sendResponse(apiData, res)

    //Here we need to reduce the size of the data to 30 cards.
    bookData = JSON.parse(apiData)
    if(bookData.length>30)bookData.length = 30

    let responseobj = {
      pokemon: textInput,
      data: bookData
    }

    res.json(JSON.stringify(responseobj))
    //next() //allow next route or middleware to run



  })
}
*/
