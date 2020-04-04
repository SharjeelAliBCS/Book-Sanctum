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
  var searchInput = document.getElementById("title").value;
  let isbn = document.getElementById("isbn").value;
  let publisher = document.getElementById("publisher").value;
  let year = document.getElementById("year").value;
  let author = document.getElementById("author").value;
  let genreInput = document.getElementById("genreSelect").value;

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
