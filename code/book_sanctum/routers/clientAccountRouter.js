let express = require('express');
let serverData = require('../data');
let accountQueries = require("../sqlQueries/accountQueries");

let accountQueryInstance = new accountQueries();

module.exports = function(app){

  let router = express.Router();

  router.get('/', get);
  router.get('/getAddresses', getAddresses);
  router.get('/getPayments', getPayments);

  function get(req, res, next) {
  }

  function getAddresses(req, res, next) {
    accountQueryInstance.getAddresses(serverData.users[req.sessionID],res);
  }

  function getPayments(req, res, next) {
    accountQueryInstance.getPayments(serverData.users[req.sessionID],res);
  }

  return router;
}
