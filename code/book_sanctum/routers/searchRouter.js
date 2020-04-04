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

  function get(req, res, next) {


    inputText = req.query.text;
    genreText = req.query.genre;
    if(genreText=="All Genres"){
      genreText = '';
    }
    data = searchQueryInstance.searchBooksByTitle(inputText,genreText,res).then(function(result){

      res.status(200).render('SearchPage.pug', {
        data: JSON.stringify(result),
        text: inputText,
        genre: genreText

      });

    });

  }

  function getType(req,res,next){
    searchQueryInstance.getAllType(req.params.type,res);
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
