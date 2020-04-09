let path = require('path');
let express = require('express');
let serverData = require('../data');

module.exports = function(app){

  let router = express.Router();

  router.get('/', get);

  function get(req, res, next) {

    res.sendFile(path.join(__dirname, '../source/pages/html/checkout.html'));
  }

  return router;
}
