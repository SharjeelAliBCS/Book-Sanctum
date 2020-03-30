let express = require('express');
let serverData = require('../data');
let orderQueries = require("../sqlQueries/orderQueries");

let orderQueryInstance = new orderQueries();

module.exports = function(app){
  let router = express.Router();

  router.get('/', get);

  function get(req, res, next) {
    orderQueryInstance.getOrders(serverData.users[req.sessionID], res);
  }

  return router;
}
