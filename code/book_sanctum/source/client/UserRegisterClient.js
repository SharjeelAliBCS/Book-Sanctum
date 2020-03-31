let reloadPage = '';
function init(){
  reloadPage = localStorage.getItem('currPage');
}

function signup(){
  var fname = document.getElementById("fname").value;
  var lname = document.getElementById("lname").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var cpassword = document.getElementById("cpassword").value;
  var user = document.getElementById("username").value;

  if(fname==''|| lname=='' ||  email=='' ||  password=='' ||  cpassword=='' || user==''){
    incorrectsignup("One of the fields is empty");
    return;
  }
  else{
    correctsignup();
  }

  if(password==cpassword){
    correctsignup();
  }
  else{

    incorrectsignup("Passwords do not match");
    return;
  }


  reqObject = {
    "user": user,
    "fname": fname,
    "lname": lname,
    "email": email,
    "pwd": password
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
    url: "/form/signup",
    data: userRequestJSON,
    dataType: "json"
  });

  request.done(function (data) {

    user = data;
    console.log(user);
    if(user==''){
      incorrectsignup("Username taken");
    }
    else{
      correctsignup();
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
