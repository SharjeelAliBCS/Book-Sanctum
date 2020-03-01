function init(){
  requestGenres();

  isbn =localStorage.getItem('ISBN');

  if(isbn!=null){
    requestBook(isbn);

  }

  //$('#genreSelect').val(text.genreInput);

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

function requestBook(isbn){
  console.log(isbn);
  var request = $.ajax({
    url: "/ISBNSearch",
    data: isbn,
    dataType: "json"
  });

  request.done(function (data) {
    var book = JSON.parse(data);
    console.log(book);

  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")
  });

}
