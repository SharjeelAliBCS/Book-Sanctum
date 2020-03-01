function init(){
  requestGenres();


  text =JSON.parse(localStorage.getItem('textInput'));

  console.log("init afffgain for data ")
  console.log(text.genreInput);

  if(text!=null){
    var searchInput = document.getElementById("searchBar").value = text.textInput;

    requestSearchData(text);
    localStorage.setItem('textInput', null);


    document.getElementById("genreSelect").selectedIndex =2;
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
  requestSearchData(userInputObj);

  console.log("testiun in seach");
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
    populateBookList(bookData.items,userInputObj.textInput);
  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")

  });

}

function populateBookList(data,textInput){
        populateFilterList(data);

        //Here we remove the html elements from the html card.
        //Got the removeChild from stackoverflow
        //https://stackoverflow.com/questions/3450593/how-do-i-clear-the-content-of-a-div-using-javascript
        let div = document.getElementById('searchListing');
        while (div.firstChild) {
          div.removeChild(div.firstChild);
        }

        console.log(" total = "  + data.length);

        //This adds the cards to the html by using the pokemonCard div.
        document.getElementById("ListHeading").textContent = `Showing ${data.length} results for ${textInput}`;
        for (let i in data) {

          let book = data[i].volumeInfo;
          //console.log(data[i]);

          //let hyperlink = 'https://pokemontcg.io/cards/' + card.id

          let divCard = document.createElement('div');

          // divCard.className = 'row';
          if(book.title!=null && book.imageLinks!=null && book.authors!=null){
            bookPrice = "CDN $"+19.99;

            divCard.innerHTML = ""
              + '<div class="book-item">'

                + '<div class="book-column book-image">'
                  + '<div role="button" id="' + book.title + '" class="card" style="width:150px; height:209px;">'
                  + '<div class="imgCard" onclick="openBookPage()"><img src= ' + book.imageLinks.thumbnail + ' style="width:150px; height:209px;"></img></div></a></div>'
                  +'</div>'

                + '<div class="book-column book-info">'
                  + '<p style="display:inline" onclick="openBookPage()" class="book-text book-title">' + book.title + '</p><br></br>'
                  + '<p class="book-text book-author">' + book.authors[0] + ' | '+ book.publishedDate +'</p><br></br>'
                  + '<p class="book-text book-price">' + bookPrice +'</p><br></br>'
                  //+ '<p style="display:inline" class="book-description">' + book.description + '</font></p>'
                + '</div>'

              + '</div>'

            document.getElementById('searchListing').appendChild(divCard);
        }


        }
        var viewportHeight = $('.grid-container').outerHeight();
        console.log(viewportHeight);
        $(".column").each(function(){
          $(this).css('height',viewportHeight+180);
        });


        console.log("done")



}
function openBookPage(isbn){
  console.log(isbn+ " page opened!");
}

function populateFilterList(data){
  var genres = {};
  for(i in data){

    for(g in data[i].volumeInfo.categories){

      var key = data[i].volumeInfo.categories[g];
      if(key in genres){
        genres[key]+=1;
      }
      else{
        genres[key]=1;
      }
    }
  }

  console.log(genres);

  for(key in genres){
    console.log(key);
    let divGenre = document.createElement('div');


    divGenre.innerHTML = ""
    +'<div>'
    + '<p style="display:inline" class="genre-text">' + `${key} (${genres[key]})` + '</p><br></br>'
    +'</div'

    document.getElementById('genreList').appendChild(divGenre);
  }




}
