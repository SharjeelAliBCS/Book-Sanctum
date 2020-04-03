function init_transactions(){
  requestSalesData('', "/alltransactionsdaily");
  requestTransactions(50);
}

function requestTransactions(size){
  console.log("heello ")
  var request = $.ajax({
    url: "/sales/transactions/"+size,
    data: "query",
    dataType: "json"
  });

  request.done(function (result) {
    let data = JSON.parse(result);
    data = formatTransactions(data);
    console.log(data);
    populateTransactions(data);

  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")
  });

}

function formatTransactions(data){
  newData = [];
  newData = data.revenue.concat(data.expenditures);
  newData.sort(compare);
  return newData;
}
//sort object
//https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
function compare(a,b) {
  if(a.order_date> b.order_date) return -1;
  if(a.order_date<b.order_date) return 1;
  return 0;
}

function populateTransactions(data){
  let div = document.getElementById('transactions');
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  let divCard = document.createElement('div');

  divCard.innerHTML = ""
    + '<div class="row">'
      + '<div class="col col-date">'
        + '<p class="header">Date</p>'
      + '</div>'
      + '<div class="col col-transaction">'
        + '<p class="header">Transaction</p>'
      + '</div>'
      + '<div class="col col-debit">'
        + '<p class="header money">Debit</p>'
      + '</div>'
      + '<div class="col col-credit">'
        + '<p class="header money">Credit</p>'
      + '</div>'
      + '<div class="col col-profit">'
        + '<p class="header money">Profit-to-Date</p>'
      + '</div>'
    + '</div>'

  let profit = 0;
  document.getElementById("total").innerHTML = data.length + " Transactions listed";
  for(let i in data){
    profit+=parseFloat(data[i].transaction);
  }
  for (let i in data) {

    let transaction = data[i];
    //console.log(transaction);
    profit-=parseFloat(transaction.transaction)
    console.log(profit);
    let debit ='';
    let credit ='';
    let name = '';
    if(transaction.transaction>=0){
      credit = transaction.transaction;
      name = "BOOK SALE: ";
    }
    else{
      debit = transaction.transaction;
      name = "PUBLISHER FEES: "
    }

    divCard.innerHTML += ""
      + '<div class="row">'
        + '<div class="col col-date">'
          + '<p class="header">'+transaction.order_date+'</p>'
        + '</div>'
        + '<div class="col col-transaction">'
          + '<p class="header">'+name + transaction.name+'</p>'
        + '</div>'
        + '<div class="col col-debit">'
          + '<p class="header money">'+debit+'</p>'
        + '</div>'
        + '<div class="col col-credit">'
          + '<p class="header money">'+credit+'</p>'
        + '</div>'
        + '<div class="col col-profit">'
          + '<p class="header money">'+profit.toFixed(2)+'</p>'
        + '</div>'
      + '</div>'

  }


    console.log(divCard);
    document.getElementById('transactions').appendChild(divCard);
}
