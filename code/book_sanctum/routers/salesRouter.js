let path = require('path');
let express = require('express');
let serverData = require('../data');
let salesQueries = require("../sqlQueries/salesQueries");

let salesQueryInstance = new salesQueries();

module.exports = function(app){

  let router = express.Router();

  router.get('/', get);
  router.get('/salespercent/:type', getSalePercent);
  router.get('/sales/:type', getSales);
  router.get('/numbers', getSaleNumbers);
  router.get('/transactions/', getTransactions);
  router.get('/allsales', getAllSales);
  router.get('/alltransactionsdaily', getAllDaily);
  router.get('/stock', getDailyStock);

  function get(req, res, next) {
    res.sendFile(path.join(__dirname, '../source/pages/html/SalesPage.html'));
  }

  function getDailyStock(req,res,next){
    data = JSON.parse(Object.keys(req.query)[0]);
    salesQueryInstance.allStock(data.start, data.end, res);
  }

  function getTransactions(req,res,next){
    data = JSON.parse(Object.keys(req.query)[0]);
    console.log("hello word: "+ data);
    salesQueryInstance.allTransactions(data.start, data.end, res);
  }

  function getSales(req,res,next){
    data = JSON.parse(Object.keys(req.query)[0]);
    type = req.params.type;
    salesQueryInstance.allTypeSales(data.start, data.end, type, res);
  }

  function getSalePercent(req,res,next){
    console.log("getting sale percent");
    type = req.params.type;
    data = JSON.parse(Object.keys(req.query)[0])
    salesQueryInstance.allTypeSalesByPercent(data.start, data.end,type, res);
  }
  function getAllSales(req, res, next){
    data = JSON.parse(Object.keys(req.query)[0]);

    salesQueryInstance.allTransactionsType(data.start, data.end, '=',res).then(function(result){
        res.json(JSON.stringify(result));
      });
  }
  function getAllDaily(req,res,next){
    data = JSON.parse(Object.keys(req.query)[0]);

    salesQueryInstance.allTransactionsType(data.start, data.end, '=',res).then(function(result1){
      salesQueryInstance.allTransactionsType(data.start, data.end, '!=',res).then(function(result2){
        obj = {"sales": result1, "expenditures": result2};

        res.json(JSON.stringify(obj));
        });
      });
  }

  function getSaleNumbers(req,res,next){
    console.log("testing for sale sum");
    data = JSON.parse(Object.keys(req.query)[0]);
    salesQueryInstance.getSalesNumbers(data.start, data.end, res);
  }

  return router;
}
