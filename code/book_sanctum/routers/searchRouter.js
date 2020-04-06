let express = require('express');
let serverData = require('../data');
let searchQueries = require("../sqlQueries/searchQueries");

let searchQueryInstance = new searchQueries();

module.exports = function(app){

  let router = express.Router();

  router.get('/', get);
  router.get('/genreList', genreList);
  router.get('/authorList', authorList);
  router.get('/:type', getType);
  router.get('/publisher/:name', getPublisher);

  function get(req, res, next) {
    genre = req.query.genre;

    if('text' in req.query){
      console.log("hello")
      inputText = req.query.text;
      if(genre=="All Genres"){
        genre = '';
      }

      data = searchQueryInstance.searchBooksByTitle(inputText,genre,res).then(function(result){

        res.status(200).render('SearchPage.pug', {
          data: JSON.stringify(result),
          text: inputText,
          genre: genre
        });
      });
    }
    else{
      title = req.query.title;
      isbn = req.query.isbn;
      publisher = req.query.publisher;
      author = req.query.author;
      year = req.query.year;

      console.log("got "+ genre+ ", "+title+ ", "+isbn+ ", "+author+ ", "+year+ ", "+publisher)
      data = searchQueryInstance.advancedBookSearch(isbn, title, genre,author, year, publisher, isbn,res).then(function(result){

        res.status(200).render('SearchPage.pug', {
          data: JSON.stringify(result),
          text: title,
          genre: genre
        });
      });
    }


  }

  function getType(req,res,next){
    searchQueryInstance.getAllType(req.params.type,res);
  }
  function getPublisher(req,res,next){
    searchQueryInstance.getPublisher(req.params.name,res);
  }

  function genreList(req,res,next){
    inputText = req.query.text;
    genreText = req.query.genre;
    //console.log("you searched for "+JSON.stringify(req.query));
    searchQueryInstance.filterBooksByGenre(inputText, genreText,res);
  }
  function authorList(req,res,next){
    inputText = req.query.text;
    genreText = req.query.genre;
    searchQueryInstance.filterBooksByAuthor(inputText, genreText,res);
  }

  return router;
}

/*
function get(req, res, next) {
  data = req.query;
  console.log("testing! testng!");
  searchQueryInstance.searchBooksByTitle(data["textInput"],res);
}*/
