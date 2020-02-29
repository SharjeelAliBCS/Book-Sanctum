const express = require('express');
const app = express();
const port = 3000;

const HTML_DIR = "/source/pages";
const CLIENT_DIR = "/source/client";
var genres = ["Sci fi", "fantasy", "mystery"];

app.use(express.static(__dirname + CLIENT_DIR));
app.use(express.static(__dirname + HTML_DIR));

app.get('/', function(req, res, next){
  console.log("test html");
  res.sendFile(__dirname + HTML_DIR + '/HomePage.html');
});

app.get('/genreData',function(req,res,next){
  res.json(JSON.stringify(genres));
});

app.get('/mainSearch', function (req, res, next) {
  let validator = Object.keys(req.query)[0];

  data = req.query;

  console.log(JSON.stringify(data));

  res.json("got the data yo~!");



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
