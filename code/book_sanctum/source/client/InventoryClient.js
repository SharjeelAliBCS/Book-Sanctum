
function init(){
  requestData('/inventory/booklist',3000);
  requestData('/search/genre','');
  requestData('/search/publisher','');
  requestData('/search/author','');
  if(localStorage.getItem('requestData')!=null){
    setDefaultInput(JSON.parse(localStorage.getItem('requestData')));
  }
}


function setDefaultInput(requestData){
  if(requestData.title!=''){
    document.getElementById("title").value =  requestData.title;
    $('#title').attr('readonly', true);
  }
  if(requestData.isbn!=''){
    document.getElementById("isbn").value =  requestData.isbn;
    $('#isbn').attr('readonly', true);
  }
  console.log(requestData)

}
function requestData(url, param){
  var request = $.ajax({
    url: url+"/"+param,
    data: "query",
    dataType: "json"
  });

  request.done(function (result) {
    let data = JSON.parse(result);
    switch(url){
      case '/inventory/booklist':
        populateScroll(data);
        break;
      case '/book':
        populateBookInfo(data);
        break;
      case '/search/genre':
        populateSelect(data,'genreSelect');
        break;
      case '/search/publisher':
        populateSelect(data,'publisherSelect');
        break;
      case '/search/author':
        populateSelect(data,'authorSelect');
        break;
    }

  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")
  });

}

function populateScroll(data){
  let div = document.getElementById('scroll');
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  let divCard = document.createElement('div');

  divCard.innerHTML = ""
  + '<div class="row">'
    + '<p class="header">ISBN</p>'
  + '</div>'
  document.getElementById('scroll').appendChild(divCard);

  document.getElementById("total").innerHTML = data.length + " books listed";
  console.log(data);

  for (let i in data) {

    let book = data[i];
    onclk = '"outputBook(\''+book.isbn+'\')" ';
    let divCard = document.createElement('div');
    divCard.innerHTML += ""
      + '<div class="row">'
        + '<p class="isbn-text pointer" onclick='+onclk + '>'+book.isbn+'</p>'
      + '</div>'
      document.getElementById('scroll').appendChild(divCard);
  }

}
function outputBook(isbn){
  console.log(isbn);
  requestData('/book',isbn)
}
function populateBookInfo(book){
  console.log(book);

  let div = document.getElementById('bookInfo');
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  let divCard = document.createElement('div');

  bookPrice = "CDN $"+book.price;
  url = `http://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;
  onclk = '"removeBook(\''+book.isbn+'\')" ';
  divCard.innerHTML = ""
    + '<div class="img-col">'
      + '<div class="img">'
          +'<img src= ' + url + ' style="width:175px; height:244;"></img>'
      +'</div>'
    +'</div>'
    +'<div class="book-info-col">'
      + '<b style="display:inline" class="title">' + book.title + '</b>'
      + '<p class="extra-text">' + book.author +'</p>'
      + '<p class="extra-text">' + book.published_date +'</p>'
      + '<p class="extra-text"> <strong>ISBN:</strong> ' +book.isbn +'</p>'
      + '<p class="extra-text"> <strong>Publisher:</strong> ' +book.publisher +'</p>'
      + '<p class="extra-text"> <strong>Genres:</strong> ' +book.genre +'</p>'
      + '<p class="extra-text"> <strong>Pages:</strong> ' +book.page_count +'</p>'
      + '<b class="extra-text">' + bookPrice +'</b>'
    +'</div>'

  + '<p style="display:inline" class="extra-text">' + book.description + '</font></p>'
  +'<button type="button" class="button"  onclick='+onclk + '>Remove Book</button>'
  console.log(divCard);
  document.getElementById('bookInfo').appendChild(divCard);

  //
}

function populateSelect(genres, id){

  genreSelect = document.getElementById(id);

  for(index in genres){
    var opt = document.createElement("option");
    opt.value= genres[index].name;
    opt.innerHTML = genres[index].name; // whatever property it has
    genreSelect.appendChild(opt);

  }
}

function addBook(){
  var title = document.getElementById("title").value;
  var isbn = document.getElementById("isbn").value;
  var price = document.getElementById("price").value;
  var percent = document.getElementById("percent").value;
  var pages = document.getElementById("pages").value;
  var year = document.getElementById("year").value;
  var description = document.getElementById("description").value;
  var author = document.getElementById("author").value;
  var genre = document.getElementById("genre").value;
  var publisher = document.getElementById("publisherSelect").value;

  if(author==''){
    author = document.getElementById("authorSelect").value;
  }
  if(genre==''){
    genre = document.getElementById("genreSelect").value;
  }


  if(title==''|| isbn=='' ||  price=='' ||  percent=='' ||  pages=='' || year==''
    || description==''){
    document.getElementById('incorrect').innerHTML = "One of the fields is empty";
    return;
  }
  else{
    document.getElementById('incorrect').innerHTML = "";
  }



  reqObject = {
    "title": title,
    "isbn": isbn,
    "price": price,
    "percent": percent,
    "pages": pages,
    "year": year,
    "description": description,
    "author": author,
    "genre": genre,
    "publisher": publisher
  };
  console.log(reqObject);
}

function removeBook(isbn){
  console.log("removed book " + isbn);

}
