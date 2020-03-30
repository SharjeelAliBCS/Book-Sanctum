let express = require('express');
let serverData = require('../data');
let bookQueries = require("../sqlQueries/bookQueries");

let bookQueryInstance = new bookQueries();

module.exports = function(app){
  let router = express.Router();

  router.get('/', get);

  function get(req, res, next) {
    console.log(req.query.isbn);
    isbn = req.query.isbn;
    data = bookQueryInstance.searchBookByISBN(isbn,res).then(function(result){

      res.status(200).render('BookPage.pug', {
        data: JSON.stringify(result[0]),
      });

    });

  }

  return router;

}

/*
function get(req, res, next) {
  data = req.query;
  bookQueryInstance.searchBookByISBN(Object.keys(data)[0], res);
}*/
//9781565125605
