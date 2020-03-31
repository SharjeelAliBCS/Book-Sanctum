function init(book){
  book = JSON.parse(book);
  init_menu_content();
  init_navbar_content();
  requestGenres();
  localStorage.setItem('currPage', 'book?isbn='+book.isbn);
  console.log(book);

  //isbn =localStorage.getItem('ISBN');

  if(book!=null){
    //requestBook(isbn);
    populateBookInfo(book);
  }
}


function requestBook(isbn){
  console.log(isbn);
  var request = $.ajax({
    url: "/book",
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

    bookPrice = "CDN $"+book.price;
    onclk = '"order(\''+book.isbn+'\')" ';
    url = `http://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;

    divCard.innerHTML = ""
      + '<div class="info-styling">'
        + '<div class="row">'

          + '<div class="info-col img-col">'
            + '<div class="img">'
                +'<img src= ' + url + ' style="width:350px; height:488;"></img>'
            +'</div>'

            +'<div class="buy">'
              + '<b class="price">' + bookPrice +'</b>'
              +'<div class="quantity">'
                + '<button type="button" onclick="changeQuantity(false)"" class="quantity-button">-</button>'
                + '<input type="text" class="quantity-text" id="quantityInput">'
                + '<button type="button" onclick="changeQuantity(true)"" class="quantity-button">+</button>'
              +'</div>'
              + '<button type="button" onclick='+onclk + ' class="order-button"> ADD TO CART</button>'
            +'</div>'

          +'</div>'

          + '<div class="info-col text-col">'
            + '<b style="display:inline" class="title">' + book.title + '</b>'
            + '<p class="author">' + book.author +'</p>'
            + '<p class="published">' + book.published_date +'</p>'
            + '<p style="display:inline" class="description">' + book.description + '</font></p>'
          + '</div>'

        + '</div>'

        + '<div class="extra-info">'
          + '<p class="extra-text"> <strong>ISBN:</strong> ' +book.isbn +'</p>'
          + '<p class="extra-text"> <strong>Publisher:</strong> ' +book.publisher +'</p>'
          + '<p class="extra-text"> <strong>Genres:</strong> ' +book.genre +'</p>'
          + '<p class="extra-text"> <strong>Pages:</strong> ' +book.page_count +'</p>'

        + '</div>'
      + '</div>'
    console.log(divCard);

    document.getElementById('bookInfo').appendChild(divCard);
    document.getElementById('quantityInput').value = 1;

    console.log("done")


}

function order(isbn){
  modifyCart(isbn, document.getElementById('quantityInput').value);
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
