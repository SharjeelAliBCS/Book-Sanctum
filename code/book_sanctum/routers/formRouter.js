let path = require('path');
let express = require('express');
let serverData = require('../data');
let accountQueries = require("../sqlQueries/accountQueries");

let accountQueryInstance = new accountQueries();

module.exports = function(app){

  let router = express.Router();

  router.get('/', get);
  router.get('/addAddress', addAddress);
  router.get('/addPayment', addPayment);
  router.get('/login', login);
  router.get('/signup', signup);

  function get(req, res, next) {
    pageName = req.query.page;
    //form?page=login
    switch(pageName){
      case "login":
        res.sendFile(path.join(__dirname, '../source/pages/html/LoginPage.html'));
        break;
      case "register":
        res.sendFile(path.join(__dirname, '../source/pages/html/UserRegisterPage.html'));
        break;
      case "address":
        res.sendFile(path.join(__dirname, '../source/pages/html/AddAddress.html'));
        break;
      case "payment":
        res.sendFile(path.join(__dirname, '../source/pages/html/AddPayment.html'));
        break;


    }
  }

  function signup(req, res, next){
    data = JSON.parse(Object.keys(req.query)[0]);
    serverData.users[req.sessionID] = accountQueryInstance.signup(data["user"], data["pwd"], data["email"], data["fname"], data["lname"], res).then(function(result){
      serverData.users[req.sessionID] = result;
      console.log("signed up username: "+ serverData.users[req.sessionID]);
      res.json(serverData.users[req.sessionID]);
    });
  }
  function login(req, res, next){

      data = JSON.parse(Object.keys(req.query)[0]);
      serverData.users[req.sessionID] = accountQueryInstance.login(data["user"], data["pwd"], res).then(function(result){

        serverData.users[req.sessionID] = result;
        console.log("saved users "+ serverData.users);
        //module.exports.users = username;
        res.json(serverData.users[req.sessionID]);
      });
  }

  function addAddress(req, res, next) {
    data = JSON.parse(Object.keys(req.query)[0]);
    accountQueryInstance.addAddress(serverData.users[req.sessionID],data["country"],data["state"],data["city"],data["code"],data["street"],data["apt"], res);
  }

  function addPayment(req, res, next) {
    data = JSON.parse(Object.keys(req.query)[0]);
    accountQueryInstance.addPayment(serverData.users[req.sessionID],data["card"],data["name"],data["expDate"],data["code"], res);
  }

  return router;
}
