let express = require('express');
let serverData = require('../data');
let searchQueries = require("../sqlQueries/searchQueries");

let searchQueryInstance = new searchQueries();

module.exports = function(app){

  let router = express.Router();

  router.get('/', get);
  router.get('/genreList', genreList);
  router.get('/authorList', authorList);

  function get(req, res, next) {
    console.log(req.query.text);
    inputText = req.query.text;
    data = searchQueryInstance.searchBooksByTitle(inputText,res).then(function(result){

      res.status(200).render('SearchPage.pug', {
        data: JSON.stringify(result),
        param: inputText
      });

    });

  }

  function genreList(req,res,next){
    data = req.query;
    data = Object.keys(data)[0];
    console.log("in genre list! "+data);
    searchQueryInstance.filterBooksByGenre(data,res);
  }
  function authorList(req,res,next){
    data = req.query;
    data = Object.keys(data)[0];
    searchQueryInstance.filterBooksByAuthor(data,res);
  }

  return router;
}

/*
function get(req, res, next) {
  data = req.query;
  console.log("testing! testng!");
  searchQueryInstance.searchBooksByTitle(data["textInput"],res);
}*/
