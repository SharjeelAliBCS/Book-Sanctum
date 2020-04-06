function init_transactions(){
    populateFilter();
  page = "transactions";
  var date = new Date();
  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = date.getFullYear();

  let start = '01/01/2020';
  let end = `${mm}/${dd}/${yyyy}`;
  let range = {"start": start, "end": end};

  init_transactions_data(range);
}

function init_transactions_data(range){

  requestSalesData('', "/alltransactionsdaily",range);
  requestTransactions(range);
}
function requestTransactions(range){

  var request = $.ajax({
    url: "/sales/transactions/",
    data: JSON.stringify(range),
    dataType: "json"
  });

  request.done(function (result) {
    let data = JSON.parse(result);
    populateTransactions(data);
  
  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")
  });

}

function formatTransactions(data){

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
  document.getElementById('transactions').appendChild(divCard);

  let profit = 0;
  document.getElementById("total").innerHTML = data.length + " Transactions listed";
  for(let i in data){
    profit+=parseFloat(data[i].amount);
  }
  for (let i in data) {

    let transaction = data[i];
    //console.log(transaction);
    profit-=parseFloat(transaction.amount)
    let debit ='';
    let credit ='';
    if(transaction.amount<0){
      debit = transaction.amount;
    }
    else{
      credit = transaction.amount;
    }

    let divCard = document.createElement('div');
    divCard.innerHTML += ""
      + '<div class="row">'
        + '<div class="col col-date">'
          + '<p class="header">'+transaction.date+'</p>'
        + '</div>'
        + '<div class="col col-transaction">'
          + '<p class="header">'+ transaction.type.toUpperCase() + ": "+transaction.name+'</p>'
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
    document.getElementById('transactions').appendChild(divCard);
  }

}
function addTransaction(){

  var name = document.getElementById("name").value;
  var amount = document.getElementById("amount").value;
  var type = document.getElementById("inputSelect").value;
  if(name==''|| amount==''){
    document.getElementById('incorrect').innerHTML = "One of the fields is empty";
    return;
  }
  else{
    document.getElementById('incorrect').innerHTML = "";

    if(type=="debit"){
      amount = -amount
    }
    reqObject = {
      "name": name,
      "amount": parseFloat(amount)
    };
    //console.log(reqObject)
    reqAddTransaction(reqObject);

  }

}


function reqAddTransaction(reqObject){
  let userRequestJSON = JSON.stringify(reqObject) //make JSON string
  var request = $.ajax({
    url: "/transactions/add",
    data: userRequestJSON,
    dataType: "json"
  });

  request.done(function (data) {
    document.getElementById("name").value='';
    document.getElementById("amount").value='';
    init_transactions();

  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")

  });
}
