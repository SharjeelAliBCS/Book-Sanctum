function init_menu_content(){
  requestData("/cart");
}

function requestData(url){

  var request = $.ajax({
    url: url,
    data: "query",
    dataType: "json"
  });

  request.done(function (req) {
    var data = JSON.parse(req);
    switch(url){
      case "/cart":
        populateOrderTab(data);
        break;
    }

  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")
  });

}

function populateOrderTab(data){
  console.log(data)

  let div = document.getElementById('cart');
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
  let price = 0;
  let total = 0;
  for (let i in data) {

    let book = data[i];

    let divCard = document.createElement('div');

      bookPrice = "CDN $"+book.price;
      url = `http://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;
      onclk = '"openBookPage(\''+book.isbn+'\')" ';
      removeBookClk = '"removeBook(\''+book.isbn+'\')" ';
      qtyId = "qty"+book.isbn;

      divCard.innerHTML = ""
      + '<div>'
          + '<div class="book-row">'

            + '<div class="book-col book-left">'
              + '<div role="button" id="' + book.title + '" class="card" style="width:100px; height:140px;">'
                + '<div class="img-card" onclick=' +onclk+ '><img src= ' + url + ' style="width:100px; height:140px;"></img></div></a>'
              +'</div>'
            + '</div>'

            + '<div class="book-col book-right">'
              + '<p class="cart-delete" onclick= '+removeBookClk+' >remove</p>'
              +'<div class="cart-quantity">'
                + '<b onclick="changeCartQuantity(false,\''+book.isbn+'\')" class="cart-quantity-button">-</b>'
                + '<input type="text" class="cart-quantity-text" id="'+qtyId+'">'
                + '<b onclick="changeCartQuantity(true,\''+book.isbn+'\')" class="cart-quantity-button">+</b>'
              +'</div>'
              + '<p class="cart-book-price">' + bookPrice +'</p>'
            + '</div>'

          +'</div>'

          + '<div class="cart-book-info">'
            + '<p onclick=' +onclk+ ' class="cart-book-title">' + book.title + '</p>'
          + '</div>'

      + '</div>'

      price +=book.quantity*book.price;
      total +=parseInt(book.quantity, 10);
      document.getElementById('cart').appendChild(divCard);
      document.getElementById(qtyId).value = book.quantity;

  }

  document.getElementById('subtotal').innerHTML = `Subtotal: CDN $${price}`;
  document.getElementById('totalItems').innerHTML = `Total items: ${total}`;

}


function changeCartQuantity(increase,isbn){
  textInput = document.getElementById("qty"+isbn);
  val = parseInt(textInput.value, 10);

  if(increase){
    console.log("increasing...");
    textInput.value = val+1;
  }
  else if(val>1){
    console.log("decreasing...");
    textInput.value =val-1;
  }
  modifyCart(isbn, document.getElementById("qty"+isbn).value);


}

function removeBook(isbn){
  console.log("removing book "+ isbn);
  modifyCart(isbn, 0);
}

function modifyCart(isbn, quantity){
  console.log("ordered book "+ isbn + " for qty "+quantity);
  reqObject = {
    "isbn": isbn,
    "quantity": quantity
  };
  reqModifyCart(reqObject);

}

function reqModifyCart(reqObject){
  let userRequestJSON = JSON.stringify(reqObject) //make JSON string
  var request = $.ajax({
    url: "/modifyCart",
    data: userRequestJSON,
    dataType: "json"
  });

  request.done(function (data) {
    if(data==''){
      alert("Log in to add items to cart.")
    }
    init_menu_content();
  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")

  });
}

function openBookPage(isbn){
  console.log(isbn+ " page opened!");

  localStorage.setItem('ISBN', isbn);
  window.location.href = "BookPage.html";
}
