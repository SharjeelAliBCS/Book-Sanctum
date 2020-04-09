function init(data, textInput,genreInput){
  init_navbar_content();
  init_menu_content();

  localStorage.setItem('currPage', "search?text="+textInput+"&genre="+genreInput);
  console.log(JSON.parse(data));
  if(textInput!=null){

    //requestSearchData(text);
    //localStorage.setItem('textInput', null);
    document.getElementById("genreSelect").selectedIndex =2;
    populateBookList(JSON.parse(data),textInput,genreInput);
  }
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
        populateOrderTab(data.items);
        break;
    }

  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")
  });

}

function requestSearchData(userInputObj){
  let userRequestJSON = JSON.stringify(userInputObj) //make JSON string
  var request = $.ajax({
    url: "/search",
    data: userInputObj,
    dataType: "json"
  });

  request.done(function (data) {

    bookData = JSON.parse(data)
    console.log("data size is " + bookData.length);
    //console.log(bookData);
    populateBookList(bookData,userInputObj.textInput);
  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")

  });

}

function populateBookList(data,textInput,genreInput){
        console.log(data);
        let userInputObj = {
          "textInput": textInput,
          "genreInput": genreInput
        };
        console.log(userInputObj)
        //filterSearch("genreList","Genres",userInputObj);
        //filterSearch("authorList","Authors",userInputObj);
        //populateFilterList(data, "authorList","Authors");
        //populateFilterList(data, "genreList","Genres");

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

          let book = data[i];
          console.log(book);
          let divCard = document.createElement('div');

            bookPrice = "CDN $"+book.price;
            url = `http://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;
            onclk = '"openBookPage(\''+book.isbn+'\')" ';

            divCard.innerHTML = ""
              + '<div class="book-item">'

                + '<div class="book-column book-image">'
                  + '<div role="button" id="' + book.title + '" class="card" style="width:150px; height:209px;">'
                  + '<div class="imgCard" onclick=' +onclk+ '><img src= ' + url + ' style="width:150px; height:209px;"></img></div></a></div>'
                  +'</div>'

                + '<div class="book-column book-info">'
                  + '<p style="display:inline" onclick=' +onclk+ ' class="book-text book-title">' + book.title + '</p><br></br>'
                  + '<p class="book-text book-author">' + book.author + ' | '+ book.published_year +'</p><br></br>'
                  + '<p class="book-text book-price">' + bookPrice +'</p><br></br>'
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
function openBookPage(isbn){
  console.log(isbn+ " page opened!");

  localStorage.setItem('ISBN', isbn);
  window.location.href = 'book?isbn='+isbn;
}
function extractFilter(data, divID, type){

}
function filterSearch(divID, type,userInputObj){

  let userRequestJSON = JSON.stringify({"textInput": userInputObj}) //make JSON string
  var request = $.ajax({
    url: "/search/"+divID,
    data: userInputObj,
    dataType: "json"
  });

  request.done(function (data) {

    filterData = JSON.parse(data)
    console.log("got data of " + data)
    populateFilterList(filterData,divID,type);
  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")

  });

}

function populateFilterList(data, divID,type){
  console.log(data);

  let div = document.getElementById(divID);
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  document.getElementById(divID).innerHTML = '<p class="genre-title">'+type+'</p>';


  for(i in data){

    let divFilter = document.createElement('div');


    divFilter.innerHTML = ""
    +'<div>'
    + '<p style="display:inline" class="genre-text">' + `${data[i].name} (${data[i].count})` + '</p><br></br>'
    +'</div'

    document.getElementById(divID).appendChild(divFilter);
  }

}
