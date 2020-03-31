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
    console.log(req.cookies);
    //res.cookie('name', 'express').send('cookie set'); //Sets name = express
    //console.log("session is " +JSON.stringify(req.sessionID ))
    res.sendFile(path.join(__dirname, '../source/pages/html/HomePage.html'));
  }

  function getBestSellers(req, res, next){
    clientHomeQueryInstance.getMostSoldBooks(res);
  }

  function getNewlyAdded(req, res, next){
    clientHomeQueryInstance.getMostRecentBooks('3',res);
  }

  function getRecentlyViewed(req, res, next){
    if(serverData.users.hasOwnProperty(req.sessionID) && serverData.users[req.sessionID]!=''){
      clientHomeQueryInstance.getViewedBooks(serverData.users[req.sessionID], res);
    }
    else{
      res.json(JSON.stringify([]));
    }


  }

  return router;

};
