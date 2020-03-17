function init(){
  init_navbar_content();

  requestData("/bestSellersData");
  requestData("/newlyAddedData");
  requestData("/recentlyViewedData");
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
      case "/bestSellersData":
        populateBookScroll(data,"bestSellersGrid");
        break;
      case "/recentlyViewedData":
        console.log(data);
        populateBookScroll(data,"recentlyViewedGrid");
        break;
      case "/newlyAddedData":
        populateNewlyAdded(data);
        break;
    }

  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")
  });

}

function populateNewlyAdded(data){

  let div = document.getElementById("mainHeader");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  colors = ["#ffaba3", "#9cffbd", "#85daff"];
  console.log("in populate newl");


  for (let i in data) {

    let book = data[i];
    console.log(book);

    let divCard = document.createElement('div');

      bookPrice = "CDN $"+book.price;

      onclk = '"openBookPage(\''+book.isbn+'\')" ';
      color = 'style="background-color:'+colors[i]+';" ';
      url = `http://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;
      console.log(color);

      divCard.innerHTML = ""
        + '<div class="newly-added" id="newlyAdded'+(i+1) +' " ' + color+'onclick=' +onclk+ '>'

              + '<div class="newly-col newly-info ">'
              + '  <b class="text-section">New release</b><br></br>'

                + '<b style="display:inline" class="newly-title">' + book.title + '</b>'
                + '<p class="newly-author">' + book.author +'</p><br></br>'
                + '<p class="newly-price">' + bookPrice +'</p><br></br>'

              + '</div>'

              + '<div class="newly-col newly-img">'

                  + '<div role="button" id="' + book.title + '" class="card" style="width:236px; height:330px;">'
                  + '<div class="imgCard" ><img src= ' + url + ' style="width:236px; height:330px;"></img></div></a></div>'

                +'</div>'

        + '</div>'


      console.log(divCard);
      document.getElementById("mainHeader").appendChild(divCard);
      //console.log(document.getElementById("mainHeader"));



  }
  var divs = $('div[id^="newlyAdded"]').hide(),
    i = 0;

    (function cycle() {
    divs.eq(i).fadeIn(600)
              .delay(5000)
              .fadeOut(600, cycle);

    i = ++i % divs.length; // increment i,
                           //   and reset to 0 when it equals divs.length
   })();

}

function populateBookScroll(data,divID){


  let div = document.getElementById(divID);
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  //console.log(" total = "  + data.length);

  //This adds the cards to the html by using the pokemonCard div.

  for (let i in data) {

    let book = data[i];

    let divCard = document.createElement('div');

      bookPrice = "CDN $"+book.price;
      onclk = '"openBookPage(\''+book.isbn+'\')" ';
      url = `http://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;

      divCard.innerHTML = ""
        + '<div class="book-item">'

            + '<div role="button" id="' + book.title + '" class="card" style="width:150px; height:209px;">'
              + '<div class="imgCard" onclick=' +onclk+ '><img src= ' + url + ' style="width:150px; height:209px;"></img></div></a>'
              +'</div>'

              + '<p onclick=' +onclk+ ' class="book-title">' + book.title + '</p>'
              + '<p class="book-author">' + book.author+'</p>'
              + '<p class="book-col book-price">' + bookPrice +'</p>'

        + '</div>'

      document.getElementById(divID).appendChild(divCard);

  }
  //
}

function openBookPage(isbn){
  console.log(isbn+ " page opened!");

  localStorage.setItem('ISBN', isbn);
  window.location.href = "BookPage.html";
}
