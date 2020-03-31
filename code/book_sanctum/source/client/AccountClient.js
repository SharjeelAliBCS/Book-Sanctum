function init(){
  localStorage.setItem('currPage', '/client_account');
  init_navbar_content();
  requestData('/getAddresses',"query");
  requestData('/getPayments',"query");

}

function requestData(url,query){

  var request = $.ajax({
    url: "/client_account"+url,
    data: query,
    dataType: "json"
  });

  request.done(function (req) {
    var data = JSON.parse(req);
    console.log(data);

    switch(url){
      case "/getAddresses":
        populateScroll(data,"addressGrid", "address","/form?page=address");
        break;
      case "/getPayments":
        populateScroll(data,"paymentGrid", "card","/form?page=payment");
      default:
        //init();
        break;
    }
  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")
  });

}

function populateAddresses(data){
  console.log(data);
}

function populateScroll(data,divID,type, link){


  let div = document.getElementById(divID);
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  let divCard = document.createElement('div');

    divCard.innerHTML = ""
      + '<div class="item add-new" onclick="location.href=`'+link+'`">'
        + '<p class="add-new-text">Add new</p>'
        + '<p class="add-new-text">'+type+'</p>'
      + '</div>'

    document.getElementById(divID).appendChild(divCard);

  for (let i in data) {

    let dataBlock = data[i];
    console.log(dataBlock);
    let divCard = document.createElement('div');

      if(type=="address"){
        divCard.innerHTML = createAddressDiv(dataBlock);
      }
      else if(type=="card"){
        divCard.innerHTML = createPaymentDiv(dataBlock);
      }

      document.getElementById(divID).appendChild(divCard);

  }
  //
}


function removeInfo(type, pKey){
  console.log("removed "+ type + " with pkey of " + pKey);
  url = "/delete"+type;
  requestData(url, {"pKey": pKey});

}
function createAddressDiv(address){
  onclk = '"removeInfo(\'Address\',\''+address.id+'\')" ';

  return ""
    + '<div class="item">'
      + '<p class="address-text"> #' + address.apt_number+'</p>'
      + '<p class="address-text">' + address.street+'</p>'
      + '<p class="address-text">' + address.city + ' ' + address.code+'</p>'
      + '<p class="address-text">' + address.state + ' ' + address.country+'</p>'
      + '<p class="remove" onclick= '+onclk+'>delete</p>'
    + '</div>'
}

function createPaymentDiv(payment){
  cardNum = payment.card_number.toString();
  cardNum = "************"+cardNum.substring(12);
  onclk = '"removeInfo(\'Payment\',\''+payment.card_number+'\')" ';

  return ""
    + '<div class="item">'
      + '<p class="address-text">' + payment.name+'</p>'
      + '<p class="address-text">' + cardNum+'</p>'
      + '<p class="address-text"> Expires: ' + payment.expiry_date+'</p>'
      + '<p class="address-text">' + payment.security_code+'</p>'
      + '<p class="remove" onclick= '+onclk+'>delete</p>'
    + '</div>'

}

function splitValue(value, index) {
    return value.substring(0, index) + "," + value.substring(index);
}
