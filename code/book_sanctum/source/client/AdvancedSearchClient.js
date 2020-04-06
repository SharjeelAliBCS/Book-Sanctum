function init(){
  requestGenres();

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

function search(){
  var title = document.getElementById("title").value;
  let isbn = document.getElementById("isbn").value;
  let publisher = document.getElementById("publisher").value;
  let year = document.getElementById("year").value;
  let author = document.getElementById("author").value;
  let genre = document.getElementById("genreSelect").value;

  if(genre=='All Genres'){
    genre=''
  }
  window.location.href = "search?title="+title+"&genre="+genre+"&publisher="+publisher+"&year="+year+"&author="+author+"&isbn="+isbn;
}

$(document).on('keypress',function(e) {
    if(e.which == 13) {
        search();
    }
});
