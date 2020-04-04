
function init(){
  requestData('/search/' ,'publisher');
}

function requestData(url, param){
  var request = $.ajax({
    url: url+"/"+param,
    data: "query",
    dataType: "json"
  });

  request.done(function (result) {
    let data = JSON.parse(result);
    switch(url){
      case '/search/':
        populateScroll(data);
        break;
      case '/search/publisher':
        populatePublisherInfo(data);
        break;
    }
  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")
  });

}

function populateScroll(data){
  let div = document.getElementById('scroll');
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  let divCard = document.createElement('div');

  divCard.innerHTML = ""
  + '<div class="row">'
    + '<p class="header">Name</p>'
  + '</div>'
  document.getElementById('scroll').appendChild(divCard);

  document.getElementById("total").innerHTML = data.length + " Publishers listed";
  console.log(data);

  for (let i in data) {

    let pub = data[i];
    onclk = '"outputPublisher(\''+pub.name+'\')" ';
    let divCard = document.createElement('div');
    divCard.innerHTML += ""
      + '<div class="row">'
        + '<p class="pointer scroll-text-pub" onclick='+onclk + '>'+pub.name+'</p>'
      + '</div>'
      document.getElementById('scroll').appendChild(divCard);
  }

}
function outputPublisher(name){
  requestData('/search/publisher',name)
}
function populatePublisherInfo(data){
  console.log(data);

  let div = document.getElementById('pubInfo');
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  let divCard = document.createElement('div');

  divCard.innerHTML = ""
  + '<b style="display:inline" class="title">Name</b><br>'
  + '<p class="pub-info-text">' + data.name +'</p>'
  + '<b style="display:inline" class="title">Phone</b><br>'
  + '<p class="pub-info-text">' + '613-232-8302' +'</p>'
  + '<b style="display:inline" class="title">Email</b><br>'
  + '<p class="pub-info-text">' + data.email +'</p>'
  + '<b style="display:inline" class="title">Direct Deposit</b><br>'
  + '<p class="pub-info-text"> <strong>Transit #:</strong> ' +'12345' +'</p>'
  + '<p class="pub-info-text"> <strong>Instituition #:</strong> ' +'004' +'</p>'
  + '<p class="pub-info-text"> <strong>Account #:</strong> ' +'193748392' +'</p>'
  + '<b style="display:inline" class="title">Address</b><br>'
  + '<p style="display:inline" class="pub-info-text">'+'#4'+' '+'123 Kernaolo Drive South'+'</p><br>'
  + '<p style="display:inline" class="pub-info-text">'+'R3D-JK4 Toronto'+'</p><br>'
  + '<p style="display:inline" class="pub-info-text">'+'ON Canada'+'</p><br>'

  console.log(divCard);
  document.getElementById('pubInfo').appendChild(divCard);


  //
}

function addPublisher(){
  var name = document.getElementById("name").value;
  var phone = document.getElementById("phone").value;
  var email = document.getElementById("email").value;
  var transit = document.getElementById("transit").value;
  var instituition = document.getElementById("instituition").value;
  var account = document.getElementById("account").value;
  var unit = document.getElementById("unit").value;
  var street = document.getElementById("street").value;
  var code = document.getElementById("code").value;
  var city = document.getElementById("city").value;
  var country = document.getElementById("country").value;

  if(name==''|| phone=='' ||  email=='' ||  transit=='' ||  instituition=='' || account==''
    || unit=='' || street=='' || code=='' || city=='' || country==''){
    document.getElementById('incorrect').innerHTML = "One of the fields is empty";
    return;
  }
  else{
    document.getElementById('incorrect').innerHTML = "";
  }

  reqObject = {
    "name": name,
    "phone": phone,
    "email": email,
    "transit": transit,
    "instituition": instituition,
    "account": account,
    "unit": unit,
    "street": street,
    "code": code,
    "city": city,
    "country": country
  };
  console.log(reqObject);
}
