let path = require('path');
let express = require('express');
let serverData = require('../data');
let searchQueries = require("../sqlQueries/searchQueries");
let bookQueries = require("../sqlQueries/bookQueries");
let bookQueryInstance = new bookQueries();

let searchQueryInstance = new searchQueries();

module.exports = function(app){

  let router = express.Router();

  router.get('/', get);
  router.get('/booklist/:size', bookList);
  router.get('/add', addBook);
  router.get('/remove', removeBook)
  function get(req, res, next) {
    res.sendFile(path.join(__dirname, '../source/pages/html/InventoryPage.html'));
  }

  function removeBook(req, res, next){
    data = Object.keys(req.query)[0];
    console.log(data);

    bookQueryInstance.removeBook(data).then(function(result){
      res.json(JSON.stringify('removed'));
    });
  }

  async function addBook(req, res, next){
    data = JSON.parse(Object.keys(req.query)[0]);
    console.log(data)

    if(isNaN(data.genre)){
      console.log("it is not anumber!")
      data["genre"] = await bookQueryInstance.addGenre(data.genre, 'fiction').then(function(result){
        return result[0].id
      });
    }
    if(isNaN(data.author)){
      console.log("it is not anumber!")
      data["author"] = await bookQueryInstance.addAuthor(data.author).then(function(result){
        return result[0].id
      });
    }

    a = await bookQueryInstance.addBook(data).then(function(result){
      res.json(JSON.stringify(data.isbn))
    });

    console.log(data)


    /*
    data["author"] = await bookQueryInstance.getType(data.author, 'author').then(function(result){
      return result[0].id
    });
    data["publisher"] = await bookQueryInstance.getType(data.publisher, 'publisher').then(function(result){
      return result[0].id
    });*/
  }
  function bookList(req, res, next){
    console.log("dj9dihffhfdf");
    searchQueryInstance.getAllBooks(req.params.size, res);
  }

  return router;
}
