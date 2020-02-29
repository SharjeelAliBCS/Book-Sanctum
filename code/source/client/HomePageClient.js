function init(){
  console.log("var");
  requestGenres();
}

function search(){
  var searchInput = document.getElementById("searchBar").value;

  console.log("searched for "+searchInput);
  genreInput = document.getElementById("genreSelect").value;
  let userInputObj = {
    "textInput": searchInput,
    "genreInput": genreInput
  };
  requestSearchData(userInputObj);
}

$(document).on('keypress',function(e) {
    if(e.which == 13) {
        search();
    }
});
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
    console.log(genres[index]);
    var opt = document.createElement("option");
    opt.value= genres[index];
    opt.innerHTML = genres[index]; // whatever property it has
    genreSelect.appendChild(opt);

  }

}

function requestSearchData(userInputObj){
  let userRequestJSON = JSON.stringify(userInputObj) //make JSON string
  var request = $.ajax({
    url: "/mainSearch",
    data: userInputObj,
    dataType: "json"
  });

  request.done(function (data) {
    console.log(data);

  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")

  });

}
