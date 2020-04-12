let path = require('path');
let express = require('express');
let serverData = require('../data');
let salesQueries = require("../sqlQueries/salesQueries");

let salesQueryInstance = new salesQueries();

module.exports = function(app){

  let router = express.Router();

  router.get('/', get);
  router.get('/add', addTransaction);

  function get(req, res, next) {
    if(serverData.users.hasOwnProperty(req.sessionID) && !serverData.users[req.sessionID].client){
      res.sendFile(path.join(__dirname, '../source/pages/html/Transactions.html'));
    }
    else{
      res.sendFile(path.join(__dirname, '../source/pages/html/error404.html'));
    }

  }

  function addTransaction(req, res, next){
    data = JSON.parse(Object.keys(req.query)[0]);
    var date = new Date();
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();

    date = mm + '/' + dd + '/' + yyyy;
    console.log(JSON.stringify(data));
    salesQueryInstance.addTransaction(data.name, data.amount, date, res);

  }

  return router;
}
