let path = require('path');
let express = require('express');
let serverData = require('../data');
let accountQueries = require("../sqlQueries/accountQueries");

let accountQueryInstance = new accountQueries();


module.exports = function(app){

  let router = express.Router();
  router.get('/', get);
  function get(req, res, next) {
    //req.session.touch()
    if(serverData.users.hasOwnProperty(req.sessionID) && !serverData.users[req.sessionID].client){
      res.sendFile(path.join(__dirname, '../source/pages/html/AdminHome.html'));
    }
    else{
      res.sendFile(path.join(__dirname, '../source/pages/html/error404.html'));
    }
  }

  return router;

};
