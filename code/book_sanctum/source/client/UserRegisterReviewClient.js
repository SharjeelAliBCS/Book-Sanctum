function init(){
  account = JSON.parse(localStorage.getItem('registerData')).info;
  address = JSON.parse(localStorage.getItem('registerData')).address;
  payment = JSON.parse(localStorage.getItem('registerData')).payment;
  localStorage.removeItem('registerData');
  console.log(payment);
  populateInfo(account);
  populateUserOrder(address, "Shipping");
  populateUserOrder(payment, "Payment");

}


function populateInfo(info){
  let div = document.getElementById('userInfo');

  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  let password = '*'.repeat(info.pwd.length);
  let divCard = document.createElement('div');

  divCard.innerHTML = ""
        + '<div class="column bio-title">'
          + '<p>First name:</p>'
          + '<p>Last name:</p>'
          + '<p>Email address:</p>'
          + '<p>Password</p>'
        + '</div>'

        + '<div class="column bio-info">'
          + '<p>'+info.fname+'</p>'
          + '<p>'+info.lname+'</p>'
          + '<p>'+info.email+'</p>'
          + '<p>'+password+'</p>'
        + '</div>'

  console.log(divCard);

  document.getElementById('userInfo').appendChild(divCard);

  console.log("done")

}

function populateUserOrder(data, type){
  let div = document.getElementById(type);

  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  let divCard = document.createElement('div');

  if(type=="Shipping"){
    divCard.innerHTML = createAddressDiv(data)
  }
  else if(type=="Payment"){
    divCard.innerHTML = createPaymentDiv(data);
  }
  console.log(divCard);

  document.getElementById(type).appendChild(divCard);

  console.log("done")

}


function register(){

}

function createAddressDiv(address){
  return ""
    + '<div class="item">'
      + '<p class="address-text"> #' + address.apt+'</p>'
      + '<p class="address-text">' + address.street+'</p>'
      + '<p class="address-text">' + address.city + ' ' + address.code+'</p>'
      + '<p class="address-text">' + address.state + ' ' + address.country+'</p>'
    + '</div>'
}

function createPaymentDiv(payment){
  cardNum = payment.card.toString();
  cardNum = "************"+cardNum.substring(12);

  return ""
    + '<div class="item">'
      + '<p class="address-text">' + payment.name+'</p>'
      + '<p class="address-text">' + cardNum+'</p>'
      + '<p class="address-text"> Expires: ' + payment.expDate+'</p>'
      + '<p class="address-text">' + payment.code+'</p>'
    + '</div>'

}
