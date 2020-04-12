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


  registerObj = {
    "user": user,
    "fname": fname,
    "lname": lname,
    "email": email,
    "pwd": password
  };
  reqNext(registerObj);
}

$(document).on('keypress',function(e) {
    if(e.which == 13) {
        reqNext();
    }
});

function reqNext(registerObj){
  var request = $.ajax({
    url: "/form/validate",
    data: JSON.stringify({"user": registerObj.user}),
    dataType: "json"
  });

  request.done(function (data) {

    user = JSON.parse(data);
    console.log("size is " + user.length);
    if(user.length==0){
      correctsignup();
      localStorage.setItem('registerData', JSON.stringify({"info": registerObj}));
      window.location.href = 'form?page=address';
    }
    else{
      incorrectsignup("Username taken");
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
