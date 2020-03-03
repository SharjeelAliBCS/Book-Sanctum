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

  console.log(loginType + " " +user+ " logged in using password "+ password);

}
