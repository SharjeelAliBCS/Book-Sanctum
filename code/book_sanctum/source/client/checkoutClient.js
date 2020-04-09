let paymentList = {};
let addressList = {};
function init(){
  localStorage.setItem('currPage', 'checkout');
  requestData('/cart_tab');
  requestData('/client_account/getAddresses');
  requestData('/client_account/getPayments');
}

function requestData(url){

  var request = $.ajax({
    url: url,
    data: "query",
    dataType: "json"
  });

  request.done(function (req) {
    var data = JSON.parse(req);
    switch(url){
      case "/cart_tab":
          let info = populateOrderItems(data);
          populateOrderStats(info);
        break;
      case "/client_account/getAddresses":
        addressList = {};
        populateOrderInfo(data, "Shipping");
        break;
      case "/client_account/getPayments":
        paymentList = {};
        populateOrderInfo(data, "Payment");
        break;

    }

  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")
  });

}

function populateOrderStats(info){
  let div = document.getElementById('orderStats');

  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  let itemCount = info.count;
  let itemsPrice = info.price;
  let shippingPrice = 3.00;
  let subtotalPrice = shippingPrice + itemsPrice;
  let taxPrice = subtotalPrice*0.13;
  let totalPrice = taxPrice+subtotalPrice;

  let divCard = document.createElement('div');

  divCard.innerHTML = ""
        +'<p class="order-stats-header">Order Review</p>'
        + '</div>'
        + '<div class="order-stats-col order-stats-title">'
          + '<p>Total Items:</p>'
          + '<p>Total Price:</p>'
          + '<p>Shipping:</p>'
          + '<p>Subtotal</p>'
          + '<p>Tax</p>'
          + '<p class="total-text">Total</p>'
        + '</div>'

        + '</div>'
        + '<div class="order-stats-col order-stats-text">'
          + '<p>'+itemCount+'</p>'
          + '<p>$'+itemsPrice.toFixed(2)+'</p>'
          + '<p>$'+shippingPrice.toFixed(2)+'</p>'
          + '<p>$'+subtotalPrice.toFixed(2)+'</p>'
          + '<p>$'+taxPrice.toFixed(2)+'</p>'
          + '<p class="total-text">$'+totalPrice.toFixed(2)+'</p>'
        + '</div>'
        + '<button type="button" onclick="order()" class="order-button">ORDER NOW</button>'

  console.log(divCard);

  document.getElementById('orderStats').appendChild(divCard);

  console.log("done")


}

function order(){
  let sOption = document.getElementById("ShippingSelect").value;
  let pOption = document.getElementById("PaymentSelect").value;
  let reqObject = {};
  reqObject["card_number"] =  paymentList[pOption].card_number;
  reqObject["address_id"] = addressList[sOption].id;
  console.log(reqObject)

  var request = $.ajax({
    url: "/cart_tab/checkout",
    data: JSON.stringify(reqObject),
    dataType: "json"
  });

  request.done(function (req) {
    window.location.href = "/client_orders";

  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")
  });

}

function populateOrderItems(data){

  console.log(data)

  let div = document.getElementById('itemsBox');
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
  let info = {"price": 0, "count": 0};
  for (let i in data) {

    let book = data[i];

    let divCard = document.createElement('div');

      bookPrice = "CDN $"+book.price;
      url = `http://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;

      divCard.innerHTML = ""
      + '<div class="book">'

        + '<div class="img">'
            + '<div><img src= ' + url + ' style="width:100px; height:140px;"></img></div></a>'
          +'</div>'

        + '<div class="info">'
          + '<p class="info-title">' + book.title + '</p>'
          + '<p>' + bookPrice +'</p>'
          + '<p class="info-small"> Qty: ' + book.quantity +'</p>'
        + '</div>'

      +'</div>'

      info.price +=book.quantity*book.price;
      info.count +=parseInt(book.quantity, 10);
      document.getElementById('itemsBox').appendChild(divCard);


  }
  return info;

}

function populateOrderInfo(data, id){

  let div = document.getElementById(id);

  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  let divCard = document.createElement('div');
  selectID = id+"Select";
  infoID = id+"Info";
  options = '';

  for(i in data){
    option = data[i];
    console.log(option);
      if(id=="Payment"){
        paymentList[option.card_number] = option;
        cardNum = option.card_number.toString().substring(12);
        options+='<option value='+option.card_number+'> Card ending in '+cardNum+'</option>'
      }
      else if(id=="Shipping"){
        addressList[option.id] = option;
        options+='<option value='+option.id+'>'+option.street+'</option>'
      }

  }
  let onchange = '"populateSelectedInfo(\''+id+'\')" ';
  addClk = '"addNew(\''+id+'\')" ';


  divCard.innerHTML = ""
  +'<p class="order-info-header">'+id+' options</p>'
  +'<div class="option-list option-col-select">'
    +'<div class="select-style">'
      +'<select id='+selectID+' onchange='+onchange+' class="select-width">'
        + options
      + '</select>'
    +'</div>'
  +'</div>'

  +'<div class="option-list option-col-add">'
    + '<p class="add-new" onclick= '+addClk+' >Add new '+id+'</p>'
  +'</div>'
  + '<div id='+infoID+'></div>';



  console.log(divCard);

  document.getElementById(id).appendChild(divCard);
  populateSelectedInfo(id);
}

function populateSelectedInfo(id){
  console.log("doing stuff");
  let div = document.getElementById(id+"Info");

  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  let divCard = document.createElement('div');
  let option = document.getElementById(id+"Select").value;
  if(id=="Payment"){
    console.log(paymentList[option])
    divCard.innerHTML = createPaymentDiv(paymentList[option]);
  }
  else if(id=="Shipping"){
    divCard.innerHTML = createAddressDiv(addressList[option]);
  }
  document.getElementById(id+"Info").appendChild(divCard);
}

function createAddressDiv(address){
  return ""
    + '<div class="item">'
      + '<p class="address-text"> #' + address.unit+'</p>'
      + '<p class="address-text">' + address.street+'</p>'
      + '<p class="address-text">' + address.city + ' ' + address.code+'</p>'
      + '<p class="address-text">' + address.region + ' ' + 'Canada'+'</p>'
    + '</div>'
}

function createPaymentDiv(payment){
  cardNum = payment.card_number.toString();
  cardNum = "************"+cardNum.substring(12);

  return ""
    + '<div class="item">'
      + '<p class="address-text">' + payment.name+'</p>'
      + '<p class="address-text">' + cardNum+'</p>'
      + '<p class="address-text"> Expires: ' + payment.expiry_date+'</p>'

    + '</div>'

}

function addNew(id){
  url = '';
  if(id=="Payment"){
    url = 'form?page=payment';
  }
  else if(id=="Shipping"){
    url = 'form?page=address';
  }
  window.location.href = url;
}
