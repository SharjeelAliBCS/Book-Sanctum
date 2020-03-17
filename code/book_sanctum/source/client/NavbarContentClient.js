function init_navbar_content(){
  requestGenres();
}

function requestGenres(){
  var request = $.ajax({
    url: "/genreData",
    data: "query",
    dataType: "json"
  });

  request.done(function (data) {
    var genres = JSON.parse(data);
    console.log(genres);
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

function search(){
  var searchInput = document.getElementById("searchBar").value;

  console.log("searched for "+searchInput);
  genreInput = document.getElementById("genreSelect").value;
  let userInputObj = {
    "textInput": searchInput,
    "genreInput": genreInput
  };
  localStorage.setItem('textInput', JSON.stringify(userInputObj));
  window.location.href = "ListPage.html";
}

$(document).on('keypress',function(e) {
    if(e.which == 13) {
        search();
    }
});
