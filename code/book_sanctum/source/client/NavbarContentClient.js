function init_navbar_content(){
  console.log("tihfeihih        eihei8f")
  requestGenres();
  requestUserLogin();
}

function requestUserLogin(){
  var request = $.ajax({
    url: "/nav",
    data: "query",
    dataType: "json"
  });

  request.done(function (data) {
    user = data;
    console.log("user is " + user);
    if(user==''){
      populateLoggedInBar(false);
    }
    else{
      populateLoggedInBar(true);
    }
  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")
  });
}

function populateLoggedInBar(flag){
  //
  //
  div = document.getElementById("loggedInBar");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  let divCard = document.createElement('div');

  if(flag){



    divCard.innerHTML = '<li><a href="nav/logout">Log out</a></li>'+
                        '<li><a href="client_account">Account</a></li>'+
                        '<li><a href="client_orders">Orders</a></li>';
  }//
  else{
    divCard.innerHTML = '<li><a href="/form?page=login">Log in</a></li>';
  }

  document.getElementById("loggedInBar").appendChild(divCard);
}

function logout(){
  var request = $.ajax({
    url: "/nav/logout",
    data: "query",
    dataType: "json"
  });

  request.done(function (data) {
    populateLoggedInBar(false);
  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")
  });
}

function requestGenres(){
  var request = $.ajax({
    url: "/nav/genres",
    data: "query",
    dataType: "json"
  });

  request.done(function (data) {
    var genres = JSON.parse(data);
    //console.log(genres);
    populateGenreSelect(genres);
  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")
  });
}

function populateGenreSelect(genres){
  genreSelect = document.getElementById("genreSelect");

  for(index in genres){
    var opt = document.createElement("option");
    opt.value= genres[index].name;
    opt.innerHTML = genres[index].name; // whatever property it has
    genreSelect.appendChild(opt);

  }
}

function homePage(){
  var request = $.ajax({
    url: "/",
    data: "query",
    dataType: "json"
  });

  request.done(function (data) {
    var genres = JSON.parse(data);
    //console.log(genres);
    populateGenreSelect(genres);
  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")
  });
}

function search(){
  var searchInput = document.getElementById("searchBar").value;


  genreInput = document.getElementById("genreSelect").value;
  let userInputObj = {
    "textInput": searchInput,
    "genreInput": genreInput
  };
  console.log("searched for "+searchInput + genreInput);
  if(genreInput=='All Genres'){
    genreInput=''
  }
  window.location.href = "search?text="+searchInput+"&genre="+genreInput;


}

$(document).on('keypress',function(e) {
    if(e.which == 13) {
        search();
    }
});
