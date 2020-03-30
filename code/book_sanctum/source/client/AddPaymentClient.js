let reloadPage = '';
function init(){
  reloadPage = localStorage.getItem('currPage');
}

function signup(){
  var name = document.getElementById("name").value;
  var card = document.getElementById("card").value;
  var code = document.getElementById("code").value;
  var expDate = document.getElementById("expDate").value;

  if(card==''|| name=='' ||  code=='' ||  expDate==''){
    incorrectsignup("One of the fields is empty");
    return;
  }
  else{
    correctsignup();
  }

  reqObject = {
    "card": card,
    "name": name,
    "expDate": expDate,
    "code": code
  };
  reqsignup(reqObject);
}

$(document).on('keypress',function(e) {
    if(e.which == 13) {
        signup();
    }
});

function reqsignup(reqObject){
  let userRequestJSON = JSON.stringify(reqObject) //make JSON string
  var request = $.ajax({
    url: "/form/addPayment",
    data: userRequestJSON,
    dataType: "json"
  });

  request.done(function (data) {

    if(reloadPage=="Account.html"){
      window.location.href = reloadPage;
    }

  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")

  });

}
function correctsignup(){
  div = document.getElementById("incorrect");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
  //localStorage.setItem('textInput', JSON.stringify(userInputObj));


}

function incorrectsignup(text){
  //<b class="incorrect-text">Incorrect username or password</b>

  div = document.getElementById("incorrect");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  let divCard = document.createElement('div');
  console.log(div);
  divCard.innerHTML = '<b class="incorrect-text">'+text+'</b>';

  document.getElementById("incorrect").appendChild(divCard);
}
