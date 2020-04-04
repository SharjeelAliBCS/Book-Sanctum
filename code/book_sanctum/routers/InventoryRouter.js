let path = require('path');
let express = require('express');
let serverData = require('../data');
let searchQueries = require("../sqlQueries/searchQueries");

let searchQueryInstance = new searchQueries();

module.exports = function(app){

  let router = express.Router();

  router.get('/', get);
  router.get('/booklist/:size', bookList);

  function get(req, res, next) {
    res.sendFile(path.join(__dirname, '../source/pages/html/InventoryPage.html'));
  }

  function bookList(req, res, next){
    console.log("dj9dihffhfdf");
    searchQueryInstance.getAllBooks(req.params.size, res);
  }

  return router;
}
