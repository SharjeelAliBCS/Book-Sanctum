let path = require('path');
let express = require('express');
let serverData = require('../data');
let orderQueries = require("../sqlQueries/orderQueries");

let orderQueryInstance = new orderQueries();

module.exports = function(app){
  let router = express.Router();

  router.get('/', get);
  router.get('/orders', getOrders);

  function get(req, res, next) {
    res.sendFile(path.join(__dirname, '../source/pages/orders.html'));
  }

  function getOrders(req, res, next){
    orderQueryInstance.getOrders(serverData.users[req.sessionID], res);
  }

  return router;
}
