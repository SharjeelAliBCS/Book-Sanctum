let path = require('path');
let express = require('express');
let serverData = require('../data');
let salesQueries = require("../sqlQueries/salesQueries");

let salesQueryInstance = new salesQueries();

module.exports = function(app){

  let router = express.Router();

  router.get('/', get);
  router.get(['/allsales','/alltransactionsdaily'], getAllSales);
  router.get('/salespercent/:type', getGenreSalesPercent);
  router.get('/sales/:type', getGenreSales);
  router.get('/saleSum', getSumSales);
  router.get('/profit', getProfit);
  router.get('/transactions/:size', getTransactions);

  function get(req, res, next) {
    res.sendFile(path.join(__dirname, '../source/pages/html/SalesPage.html'));
  }

  function getTransactions(req,res,next){
    console.log("yayagag");
    salesQueryInstance.allRevenue(req.params.size).then(function(result1){

      salesQueryInstance.allExpenditures(req.params.size).then(function(result2){

        data = {"revenue": result1, "expenditures": result2};
        res.json(JSON.stringify(data));
      });
    });

  }

  function getGenreSales(req,res,next){
    type = req.params.type;
    salesQueryInstance.allTypeSales(type, res);
  }

  function getGenreSalesPercent(req,res,next){
    type = req.params.type;
    salesQueryInstance.allTypeSalesByPercent(type, res);
  }

  function getAllSales(req,res,next){
    salesQueryInstance.getAllSales(res);
  }

  function getSumSales(req,res,next){
    salesQueryInstance.getSalesSum(res);
  }

  function getProfit(req,res,next){
    salesQueryInstance.getRevenue().then(function(result){
      res.json(JSON.stringify(result));
    });
  }

  return router;
}
