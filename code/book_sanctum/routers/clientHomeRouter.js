let path = require('path');
let express = require('express');
let serverData = require('../data');
let clientHomeQueries = require("../sqlQueries/clientHomeQueries");

let clientHomeQueryInstance = new clientHomeQueries();


module.exports = function(app){

  let router = express.Router();
  router.get('/', get);
  router.get('/bestSellers', getBestSellers);
  router.get('/newlyAdded', getNewlyAdded);
  router.get('/recentlyViewed', getRecentlyViewed);

  function get(req, res, next) {
    //req.session.touch()
    console.log("session is " +JSON.stringify(req.sessionID ))
    res.sendFile(path.join(__dirname, '../source/pages/HomePage.html'));
  }

  function getBestSellers(req, res, next){
    clientHomeQueryInstance.getMostSoldBooks(res);
  }

  function getNewlyAdded(req, res, next){
    clientHomeQueryInstance.getMostRecentBooks('3',res);
  }

  function getRecentlyViewed(req, res, next){
    clientHomeQueryInstance.searchBooksByTitle("earth",res);
  }

  return router;

};
