function init(){
  requestData("/genreData");
  requestData("/bestSellersData");
  //requestData("/newlyAddedData");
  requestData("/recentlyViewedData");

}

function requestBestSellers(){
}

function requestRecentlyViewed(){
}

function requestNewlyAdded(){
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

function requestData(url){

  var request = $.ajax({
    url: url,
    data: "query",
    dataType: "json"
  });

  request.done(function (req) {
    var data = JSON.parse(req);
    switch(url){
      case "/genreData":
        populateGenreSelect(data);
        break;
      case "/bestSellersData":
        populateBookScroll(data.items,"bestSellersGrid");
        break;
      case "/recentlyViewedData":
        console.log(data.items);
        populateBookScroll(data.items,"recentlyViewedGrid");
        break;
      case "/newlyAddedData":
        populateNewlyAdded(data.items);
        break;
    }

  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")
  });

}

function populateBookScroll(data,divID){


  let div = document.getElementById(divID);
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  //console.log(" total = "  + data.length);

  //This adds the cards to the html by using the pokemonCard div.

  for (let i in data) {

    let book = data[i].volumeInfo;

    let divCard = document.createElement('div');

    // divCard.className = 'row';
    if(book.title!=null && book.imageLinks!=null && book.authors!=null){
      bookPrice = "CDN $"+19.99;

      onclk = '"openBookPage(\''+data[i].id+'\')" ';

      divCard.innerHTML = ""
        + '<div class="book-item">'

            + '<div role="button" id="' + book.title + '" class="card" style="width:150px; height:209px;">'
              + '<div class="imgCard" onclick=' +onclk+ '><img src= ' + book.imageLinks.thumbnail + ' style="width:150px; height:209px;"></img></div></a>'
              +'</div>'

              + '<p onclick=' +onclk+ ' class="book-title">' + book.title + '</p>'
              + '<p class="book-author">' + book.authors[0]+'</p>'
              + '<p class="book-col book-price">' + bookPrice +'</p>'

        + '</div>'

      document.getElementById(divID).appendChild(divCard);
    }


  }
  //
}

function openBookPage(isbn){
  console.log(isbn+ " page opened!");

  localStorage.setItem('ISBN', isbn);
  window.location.href = "BookPage.html";
}

function populateRecentlyViewed(data){

}


function populateNewlyAdded(data){

}


function populateGenreSelect(genres){
  genreSelect = document.getElementById("genreSelect");

  for(index in genres){
    var opt = document.createElement("option");
    opt.value= genres[index];
    opt.innerHTML = genres[index]; // whatever property it has
    genreSelect.appendChild(opt);

  }
}
