function init(){
  localStorage.setItem('currPage', 'Account.html');
  init_navbar_content();
  requestData('/getAddresses');
  populateScroll([],"paymentGrid", "card","AddPayment.html");
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
      case "/getAddresses":
        populateScroll(data,"addressGrid", "address","AddAddress.html");
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

    let address = data[i];
    console.log(address);
    let divCard = document.createElement('div');

      divCard.innerHTML = ""
        + '<div class="item">'

          + '<p class="address-text"> #' + address.apt_number+'</p>'
          + '<p class="address-text">' + address.street+'</p>'
          + '<p class="address-text">' + address.city + ' ' + address.code+'</p>'
          + '<p class="address-text">' + address.state + ' ' + address.country+'</p>'

        + '</div>'

      document.getElementById(divID).appendChild(divCard);

  }
  //
}
