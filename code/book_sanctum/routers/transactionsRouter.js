let path = require('path');
let express = require('express');
let serverData = require('../data');
let salesQueries = require("../sqlQueries/salesQueries");

let salesQueryInstance = new salesQueries();

module.exports = function(app){

  let router = express.Router();

  router.get('/', get);

  function get(req, res, next) {
    res.sendFile(path.join(__dirname, '../source/pages/html/Transactions.html'));
  }

  return router;
}
