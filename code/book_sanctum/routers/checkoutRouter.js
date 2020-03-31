let path = require('path');
let express = require('express');
let serverData = require('../data');
let cartTabQueries = require("../sqlQueries/cartTabQueries");
let accountQueries = require("../sqlQueries/accountQueries");
let cartTabQueryInstance = new cartTabQueries();
let accountQueryInstance = new accountQueries();

module.exports = function(app){

  let router = express.Router();

  router.get('/', get);

  function get(req, res, next) {

    /*res.status(200).render('CheckoutPage.pug', {
      //data: JSON.stringify(result[0]),
    });*/
    res.sendFile(path.join(__dirname, '../source/pages/html/checkout.html'));
  }

  return router;
}
