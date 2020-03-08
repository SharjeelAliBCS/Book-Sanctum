function init(){

  init_menu_content();
  requestData("/genreData");

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
      case "/cart":
        populateOrderTab(data.items);
        break;
    }

  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")
  });

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
        populateFilterList(data,"categories","genreList","Genres");
        populateFilterList(data,"authors","authorList","Authors");

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

            onclk = '"openBookPage(\''+data[i].id+'\')" ';

            divCard.innerHTML = ""
              + '<div class="book-item">'

                + '<div class="book-column book-image">'
                  + '<div role="button" id="' + book.title + '" class="card" style="width:150px; height:209px;">'
                  + '<div class="imgCard" onclick=' +onclk+ '><img src= ' + book.imageLinks.thumbnail + ' style="width:150px; height:209px;"></img></div></a></div>'
                  +'</div>'

                + '<div class="book-column book-info">'
                  + '<p style="display:inline" onclick=' +onclk+ ' class="book-text book-title">' + book.title + '</p><br></br>'
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

  localStorage.setItem('ISBN', isbn);
  window.location.href = "BookPage.html";
}

function populateFilterList(data,searchParam,divID,type){

  let div = document.getElementById(divID);
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  document.getElementById(divID).innerHTML = '<p class="genre-title">'+type+'</p>';


  var filterList = {};
  for(i in data){

    for(g in data[i].volumeInfo[searchParam]){

      var key = data[i].volumeInfo[searchParam][g];
      if(key in filterList){
        filterList[key]+=1;
      }
      else{
        filterList[key]=1;
      }
    }
  }


  for(key in filterList){

    let divFilter = document.createElement('div');


    divFilter.innerHTML = ""
    +'<div>'
    + '<p style="display:inline" class="genre-text">' + `${key} (${filterList[key]})` + '</p><br></br>'
    +'</div'

    document.getElementById(divID).appendChild(divFilter);
  }

}
