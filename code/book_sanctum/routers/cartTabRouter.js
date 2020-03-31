let express = require('express');
let serverData = require('../data');
let cartTabQueries = require("../sqlQueries/cartTabQueries");
let cartTabQueryInstance = new cartTabQueries();

module.exports = function(app){

  let router = express.Router();

  router.get('/', get);
  router.get('/modifyCart', modifyCart);
  router.get('/checkout', checkout);


  function get(req, res, next) {
    data = req.query;
    cartTabQueryInstance.getCartList(serverData.users[req.sessionID],res);
  }

  function modifyCart(req, res, next) {
    console.log("testing for "+ req.sessionID)
    console.log(JSON.stringify(serverData.users))
    if(!serverData.users.hasOwnProperty(req.sessionID) || serverData.users[req.sessionID]==''){
      res.json('');
    }
    else{
    data = JSON.parse(Object.keys(req.query)[0]);
    cartTabQueryInstance.addtoCart(serverData.users[req.sessionID], data["isbn"], data["quantity"], res);
    }
  }

  function checkout(req, res, next) {
    var date = new Date();
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();

    date = mm + '/' + dd + '/' + yyyy;
    cartTabQueryInstance.checkoutOrder(serverData.users[req.sessionID],date, res);

  }

  return router;
}
