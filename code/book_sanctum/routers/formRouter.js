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
  router.get('/validate', validate);

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
      case "search":
        res.sendFile(path.join(__dirname, '../source/pages/html/AdvancedSearchPage.html'));
        break;
      case "review":
        res.sendFile(path.join(__dirname, '../source/pages/html/UserRegisterReview.html'));
        break;

    }
  }

  function validate(req, res, next){
    let query = JSON.parse(Object.keys(req.query)[0]);
    if("user" in query){
      accountQueryInstance.validateEmail(query.user, res);
    }


  }

  function signup(req, res, next){
    data = JSON.parse(Object.keys(req.query)[0]);
    info = data.info;
    address = data.address;
    pay = data.payment;
    console.log(data)
    serverData.users[req.sessionID] = accountQueryInstance.signup(info["user"], info["pwd"], info["email"], info["fname"], info["lname"], res).then(function(result){
        serverData.users[req.sessionID] = {"user": result, "client": true};

      accountQueryInstance.addPayment(info["user"],pay["card"],pay["name"],pay["expDate"], res,false)
      console.log("signed up username: "+ serverData.users);
      accountQueryInstance.addAddress(info["user"],address["state"],address["city"],address["code"],address["street"],address["apt"], res)
      //res.json(serverData.users[req.sessionID].user);
    });
  }
  function login(req, res, next){
    data = JSON.parse(Object.keys(req.query)[0]);
    console.log(data);

    if(data.client){
      accountQueryInstance.login(data["user"], data["pwd"], res).then(function(result){

        serverData.users[req.sessionID] = {"user": result, "client": true};
        console.log("saved admin "+ JSON.stringify(serverData.users[req.sessionID]));

        res.json(serverData.users[req.sessionID].user);
      });
    }
    else{
      accountQueryInstance.loginAdmin(data["user"], data["pwd"], res).then(function(result){

        serverData.users[req.sessionID] = {"user": result, "client": false};
        console.log("saved users "+ serverData.users);
        res.json(serverData.users[req.sessionID].user);
      });
    }
  }

  function addAddress(req, res, next) {
    data = JSON.parse(Object.keys(req.query)[0]);
    accountQueryInstance.addAddress(serverData.users[req.sessionID].user,data["state"],data["city"],data["code"],data["street"],data["apt"], res);
  }

  function addPayment(req, res, next) {
    data = JSON.parse(Object.keys(req.query)[0]);
    accountQueryInstance.addPayment(serverData.users[req.sessionID].user,data["card"],data["name"],data["expDate"], res, true);
  }

  return router;
}
