let path = require('path');
let express = require('express');
let serverData = require('../data');
let salesQueries = require("../sqlQueries/salesQueries");
let salesQueryInstance = new salesQueries();
let bookQueries = require("../sqlQueries/bookQueries");
let bookQueryInstance = new bookQueries();

module.exports = function(app){

  let router = express.Router();

  router.get('/', get);
  router.get('/add', addPublisher);

  function get(req, res, next) {
    res.sendFile(path.join(__dirname, '../source/pages/html/SellerPage.html'));
  }

function addPublisher(req, res, next){
  data = JSON.parse(Object.keys(req.query)[0]);
  console.log(data);

  bookQueryInstance.addPubCity(data.code, data.city).then(function(a){
    bookQueryInstance.addPubAddress(data.region, data.code, data.street, data.unit).then(function(b){
      bookQueryInstance.addPublisher(data.name, data.phone, data.email, b[0].id, data.rn, data.an).then(function(c){
        res.json(JSON.stringify(data.name));
      });
    });
  });

}

  return router;
}
