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
    bookData = JSON.parse(data)
    console.log("data size is " + bookData.length);
    //console.log(bookData);
    populateBookList(bookData.items);
  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")

  });

}

function populateBookList(data){

        //Here we remove the html elements from the html card.
        //Got the removeChild from stackoverflow
        //https://stackoverflow.com/questions/3450593/how-do-i-clear-the-content-of-a-div-using-javascript
        let div = document.getElementById('searchListing');
        while (div.firstChild) {
          div.removeChild(div.firstChild);
        }

        console.log(" total = "  + data.length);

        //This adds the cards to the html by using the pokemonCard div.

        for (let i in data) {

          let book = data[i].volumeInfo;
          console.log(book)
          //let hyperlink = 'https://pokemontcg.io/cards/' + card.id

          let divCard = document.createElement('div');

          // divCard.className = 'row';

          divCard.innerHTML = ""
            + '<div class="book-item">'

              + '<div class="book-column book-image">'
                + '<div role="button" id="' + book.title + '" class="card" style="width:170px; height:237px;">'
                + '<div class="imgCard"><img src= ' + book.imageLinks.thumbnail + ' style="width:170px; height:237px;"></img></div></a></div>'
                +'</div>'

              + '<div class="book-column book-info">'
                + '<p style="display:inline" class="pokemonName">' + book.title + '</font></p><br></br>'
                //+ '<p style="display:inline" class="book-description">' + book.description + '</font></p>'
              + '</div>'

            + '</div>'

          document.getElementById('searchListing').appendChild(divCard);


        }
        var viewportHeight = $('.grid-container').outerHeight();
        console.log(viewportHeight);
        $(".column").each(function(){
          $(this).css('height',viewportHeight+180);
        });


        console.log("done")



}
