let path = require('path');
let express = require('express');
let serverData = require('../data');
let requestQueries = require("../sqlQueries/requestBookQueries");

let requestQueryInstance = new requestQueries();

module.exports = function(app){
  let router = express.Router();

  router.get('/', get);
  router.get('/add', addRequest);
  router.get('/clientrequest', getClientRequests);
  router.get('/list', getAllRequests);
  router.get('/decide', setDescision);


  function get(req, res, next) {
    if(serverData.users[req.sessionID].client){
      res.sendFile(path.join(__dirname, '../source/pages/html/RequestPage.html'));
    }
    else{
      res.sendFile(path.join(__dirname, '../source/pages/html/AdminRequestPage.html'));
    }
  }

  function setDescision(req, res, next){
    data = JSON.parse(Object.keys(req.query)[0]);
    requestQueryInstance.addDescision(serverData.users[req.sessionID].user, data.num, data.desc, res);
  }

  function addRequest(req, res, next){
    data = JSON.parse(Object.keys(req.query)[0]);
    requestQueryInstance.addRequest(serverData.users[req.sessionID].user, data.isbn, data.title, res);
  }

  function getClientRequests(req, res, next){
    requestQueryInstance.getClientRequests(serverData.users[req.sessionID].user, res);
  }

  function getAllRequests(req, res, next){
    requestQueryInstance.getRequests(res);
  }


  return router;
}
