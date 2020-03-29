const express = require('express');
const https = require('https') //food2fork now requires https
let http = require('http')
let sqlQueries = require("./sqlQueries");

let sqlInstance = new sqlQueries();

const app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();

const HTML_DIR = "/source/pages";
const CLIENT_DIR = "/source/client";

let username = '';

app.use(express.static(__dirname + CLIENT_DIR));
app.use(express.static(__dirname + HTML_DIR));

let clients =[];

app.get('/', function(req, res, next){
  console.log("test html");
  res.sendFile(__dirname + HTML_DIR + '/HomePage.html');
});

app.get('/orders', function(req, res, next){
  sqlInstance.getOrders(username, res);
})

app.get('/getAddresses', function(req, res, next){
  sqlInstance.getAddresses(username,res);
})
app.get('/addAddress', function(req, res, next){
  data = JSON.parse(Object.keys(req.query)[0]);
  sqlInstance.addAddress(username,data["country"],data["state"],data["city"],data["code"],data["street"],data["apt"], res);
})

app.get('/checkout', function(req, res, next){
  var date = new Date();
  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = date.getFullYear();

date = mm + '/' + dd + '/' + yyyy;
  sqlInstance.checkoutOrder(username,date, res);

});

app.get('/login',function(req,res,next) {

  data = JSON.parse(Object.keys(req.query)[0]);
  username = sqlInstance.login(data["user"], data["pwd"], res).then(function(result){
    username = result;
    console.log("saved username: "+ username);
    res.json(username);
  });
});

app.get('/loggedIn', function(req, res, next){
  res.json(username);
});

app.get('/signup', function(req, res, next){
  data = JSON.parse(Object.keys(req.query)[0]);
  username = sqlInstance.signup(data["user"], data["pwd"], data["email"], data["fname"], data["lname"], res).then(function(result){
    username = result;
    console.log("signed up username: "+ username);
    res.json(username);
  });
});


app.get('/ListPage.html', function(req, res, next){
  console.log("list html");
  res.sendFile(__dirname + HTML_DIR + '/ListPage.html');
});

app.get('/genreData',function(req,res,next){
  sqlInstance.getGenres(res);
});

app.get('/logout', function(req, res, next){
  username = '';
  res.json('');
});

app.get('/modifyCart',function(req,res,next){
  console.log("testing for "+ username)
  if(username==''){
    res.json('');
  }
  else{
  data = JSON.parse(Object.keys(req.query)[0]);
  sqlInstance.addtoCart(username, data["isbn"], data["quantity"], res);
  }
});


app.get('/bestSellersData',function(req,res,next){
  sqlInstance.searchBooksByTitle("river",res);
  //getBooksURL({"textInput": "self improvement"}, res, next,10);
});

app.get('/cart',function(req,res,next){
  console.log("in cart");
  sqlInstance.getCartList(username,res);
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
  data = req.query;
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

server.listen(process.env.PORT || 3000)

function getGenres(){

}
