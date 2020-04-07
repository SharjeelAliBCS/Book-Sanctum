function init(){
  init_navbar_content();
  reqOrders();
}

function reqOrders(){
  var request = $.ajax({
    url: "/client_orders/orders",
    data: "query",
    dataType: "json"
  });

  request.done(function (req) {
    data = JSON.parse(req);
    //console.log(data);
    populateOrders(data);


  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")
  });

}

function populateOrders(data){
  orders = {};
  for(let i =0; i<data.length; i++){
    num = data[i].order_number.toString(10);

    !(num in orders) && (orders[num] = [])

    orders[num].push(data[i]);
  }

  let div = document.getElementById('orders');
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  for(let a = 0; a<Object.keys(orders).reverse().length; a++){

    num = Object.keys(orders).reverse()[a];
    let divBooks='';
    order = orders[num];
    total = 0;
    let card_number = order[0].card_number.toString().substring(12);
    let address = `${order[0].unit} ${order[0].street} ${order[0].city}, ${order[0].region} ${order[0].code}`
    console.log(address)
    for(let i = 0; i<order.length; i++){
      book = order[i];

      total += parseFloat(book.price*book.quantity);

        bookPrice = "CDN $"+book.price;
        url = `http://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;
        onclk = '"openBookPage(\''+book.isbn+'\')" ';

      divBooks +=""
      + '<div class="book">'

        + '<div class="img">'
            + '<div onclick=' +onclk+ '><img src= ' + url + ' style="width:100px; height:140px;"></img></div></a>'
          +'</div>'

        + '<div class="info">'
          + '<p class="info-title" onclick=' +onclk+ '>' + book.title + '</p>'
          + '<p class="info-small info-author">' + book.author +'</p>'
          + '<p>' + bookPrice +'</p>'
          + '<p class="info-small"> Qty: ' + book.quantity +'</p>'
        + '</div>'

      +'</div>'


    }
    total = total.toFixed(2);

    let divCard = document.createElement('orderBlock');



      divCard.innerHTML = ""
      + '<div class="order-box">'
        + '<div class="order-header">'

          + '<div class="order-header-text">'
            +'<p>Ordered on</p>'
            +'<p>'+order[0].order_date.split('T')[0]+'</p>'
          + '</div>'

          + '<div class="order-header-text">'
            +'<p>Total price</p>'
            +'<p>CAD $'+total+'</p>'
          + '</div>'

          + '<div class="order-header-text">'
            +'<p>Shipping</p>'
            +'<p>'+address+'</p>'
          + '</div>'

          + '<div class="order-header-text">'
            +'<p>Billing</p>'
            +'<p>Card ending in '+card_number+'</p>'
          + '</div>'

          + '<div class="order-header-text">'
            +'<p>Order #</p>'
            +'<p>'+num+'</p>'
          + '</div>'

          + '<div class="order-header-text">'
            +'<p>Status</p>'
            +'<p>'+order[0].status+'</p>'
          + '</div>'

        + '</div>'
        + '<div>'
          +divBooks
        +'</div>'
      + '</div>'

      //price +=book.quantity*book.price;
      //total +=parseInt(book.quantity, 10);


      document.getElementById('orders').appendChild(divCard);



  }
  console.log(document.getElementById('orders'));




}

function openBookPage(isbn){
  console.log(isbn+ " page opened!");

  localStorage.setItem('ISBN', isbn);
  window.location.href = 'book?isbn='+isbn;
}
