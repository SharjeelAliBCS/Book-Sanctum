function init(){
  toggle();
}
function toggle(){
  $('#toggle').change(function(){

    div = document.getElementById("toggleText");
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }

    let divCard = document.createElement('div');

    if(this.checked) {
        console.log(div);
        divCard.innerHTML = '<b class="toggle-text">Log in as Owner</b>';
    }
    else {
      console.log("off");
      divCard.innerHTML = '<b class="toggle-text">Log in as User</b>';
    }

    document.getElementById("toggleText").appendChild(divCard);
});
}
function login(){

  var user = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  loginType = document.getElementById("toggle").checked;

  reqObject = {
    "user": user,
    "pwd": password
  };
  reqLogin(reqObject);


  console.log(loginType + " " +user+ " logged in using password "+ password);

}

$(document).on('keypress',function(e) {
    if(e.which == 13) {
        login();
    }
});

function reqLogin(reqObject){
  let userRequestJSON = JSON.stringify(reqObject) //make JSON string
  var request = $.ajax({
    url: "/login",
    data: userRequestJSON,
    dataType: "json"
  });

  request.done(function (data) {

    user = data;
    if(user==''){
      incorrectLogin();
    }
    else{
      correctLogin();
    }

  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")

  });

}
function correctLogin(){
  div = document.getElementById("incorrect");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  //localStorage.setItem('textInput', JSON.stringify(userInputObj));
  window.location.href = "HomePage.html";

}

function incorrectLogin(){
  //<b class="incorrect-text">Incorrect username or password</b>

  div = document.getElementById("incorrect");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  let divCard = document.createElement('div');
  console.log(div);
  divCard.innerHTML = '<b class="incorrect-text">Incorrect username or password</b>';

  document.getElementById("incorrect").appendChild(divCard);
}

function createAccount(){
  console.log("creating account");
}
