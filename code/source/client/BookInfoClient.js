function init(){
  requestGenres();

  isbn =localStorage.getItem('ISBN');

  if(isbn!=null){
    requestBook(isbn);

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
    populateBookInfo(book);

  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")
  });

}

function populateBookInfo(book){

  isbn = book.id;
  book = book.volumeInfo;
  //Here we remove the html elements from the html card.
  //Got the removeChild from stackoverflow
  //https://stackoverflow.com/questions/3450593/how-do-i-clear-the-content-of-a-div-using-javascript
  let div = document.getElementById('bookInfo');
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  //console.log(data[i]);
  //let hyperlink = 'https://pokemontcg.io/cards/' + card.id

  let divCard = document.createElement('div');

  // divCard.className = 'row';
  if(book.title!=null && book.imageLinks!=null && book.authors!=null){
    bookPrice = "CDN $"+19.99;

    onclk = '"order(\''+isbn+'\')" ';

    divCard.innerHTML = ""
      + '<div class="info-styling">'
        + '<div class="row">'

          + '<div class="info-col img-col">'
            + '<div class="img">'
                +'<img src= ' + book.imageLinks.thumbnail + ' style="width:350px; height:488;"></img>'
            +'</div>'

            +'<div class="buy">'
              + '<b class="price">' + bookPrice +'</b>'
              +'<div class="quantity">'
                + '<button type="button" onclick="changeQuantity(false)"" class="quantity-button">-</button>'
                + '<input type="text" class="quantity-text" id="quantityInput">'
                + '<button type="button" onclick="changeQuantity(true)"" class="quantity-button">+</button>'
              +'</div>'
              + '<button type="button" onclick='+onclk + ' class="order-button"> ORDER NOW</button>'
            +'</div>'

          +'</div>'

          + '<div class="info-col text-col">'
            + '<b style="display:inline" class="title">' + book.title + '</b>'
            + '<p class="author">' + book.authors[0] +'</p>'
            + '<p class="published">' + book.publishedDate +'</p>'
            + '<p style="display:inline" class="description">' + book.description + '</font></p>'
          + '</div>'

        + '</div>'

        + '<div class="extra-info">'
          + '<p class="extra-text"> <strong>ISBN:</strong> ' +isbn +'</p>'
          + '<p class="extra-text"> <strong>Publisher:</strong> ' +book.publisher +'</p>'
          + '<p class="extra-text"> <strong>Genres:</strong> ' +book.categories[0] +'</p>'
          + '<p class="extra-text"> <strong>Pages:</strong> ' +book.pageCount +'</p>'

        + '</div>'
      + '</div>'
    console.log(divCard);

    document.getElementById('bookInfo').appendChild(divCard);
    document.getElementById('quantityInput').value = 1;
    console.log("done")
  }

}

function order(isbn){
  console.log("ordered book "+ isbn);
}

function changeQuantity(increase){
  textInput = document.getElementById('quantityInput');
  val = parseInt(textInput.value, 10);

  if(increase){
    console.log("increasing...");
    textInput.value = val+1;
  }
  else if(val>1){
    console.log("decreasing...");
    textInput.value =val-1;
  }

}
