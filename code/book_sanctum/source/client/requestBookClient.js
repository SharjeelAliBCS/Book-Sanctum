function init(){
  init_navbar_content();
  requestData('/clientrequest', '');
}
function init_admin(){
   window.localStorage.removeItem('requestData');
  requestData('/list', '');
}

function requestBook(){
  let title = document.getElementById("title").value;
  let isbn = document.getElementById("isbn").value;

  if(title =='' && isbn ==''){
    document.getElementById("incorrect").innerHTML = "No title or isbn inputted";
    return;
  }
  document.getElementById("incorrect").innerHTML = "";
  let reqObject = {
    "title": title,
    "isbn": isbn
  }
  console.log(reqObject);
  requestData('/add', JSON.stringify(reqObject));
}

function requestData(url, data){
  var request = $.ajax({
    url: "/request"+url,
    data: data,
    dataType: "json"
  });

  request.done(function (result) {
    let data = JSON.parse(result);
    switch (url){
      case "/add":
        requestData('/clientrequest', '');
        break;
      case "/clientrequest":
        populateRequests(data);
        break;
      case "/list":
        populateRequestsAdmin(data);
        break;
      case "/decide":
        requestData('/list', '');
        break;
    }
  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")
  });

}
function populateRequests(data){
    document.getElementById('listNum').innerHTML = data.length + " request(s) found";
    console.log(data);

    let div = document.getElementById('list');
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }

    let divCard = document.createElement('div');

    divCard.innerHTML = ""
      + '<div class="row">'
        + '<div class="request-list-num col">'
          + '<p class="list-text list-title">#</p>'
        + '</div>'
        + '<div class="request-list-isbn col">'
          + '<p class="list-text list-title">Request ISBN</p>'
        + '</div>'
        + '<div class="request-list-title col">'
          + '<p class="list-text list-title">Request Title</p>'
        + '</div>'
        + '<div class="request-list-date col">'
          + '<p class="list-text list-title">Date</p>'
        + '</div>'
        + '<div class="request-list-status col">'
          + '<p class="list-text list-title">Status</p>'
        + '</div>'

      + '</div>'
    document.getElementById('list').appendChild(divCard);

    for (let i in data) {

      let request = data[i];
      let status = 'N/A'

      if(request.decision==null){
        status='<p class="list-text">'+status+'</p>'
      }
      else{
        let desc = 'Approved'
        if(!request.decision)desc = 'Rejected';
        text = `${desc} on ${request.desc_date.split('T')[0]}`
        status = '<p class="list-text">'+text+'</p>'
      }

      date = request.req_date.split('T');
      console.log(date);
      let divCard = document.createElement('div');
      divCard.innerHTML += ""
      + '<div class="row">'
        + '<div class="request-list-num col">'
          + '<p class="list-text">'+request.request_number+'</p>'
        + '</div>'
      + '<div class="request-list-isbn col">'
          + '<p class="list-text">'+request.isbn+'</p>'
        + '</div>'
        + '<div class="request-list-title col">'
          + '<p class="list-text">'+request.title+'</p>'
        + '</div>'
        + '<div class="request-list-date col">'
          + '<p class="list-text">'+date[0]+'</p>'
        + '</div>'
        + '<div class="request-list-status col">'
          + status
        + '</div>'

      + '</div>'
      document.getElementById('list').appendChild(divCard);
    }
}

function populateRequestsAdmin(data){
    document.getElementById('listNum').innerHTML = data.length + " request(s) found";
    console.log(data);

    let div = document.getElementById('list');
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }

    let divCard = document.createElement('div');

    divCard.innerHTML = ""
      + '<div class="row">'
        + '<div class="admin-list-num col">'
          + '<p class="list-text list-title">#</p>'
        + '</div>'
        + '<div class="admin-list-user col">'
          + '<p class="list-text list-title">Username</p>'
        + '</div>'
        + '<div class="admin-list-isbn col">'
          + '<p class="list-text list-title">Request ISBN</p>'
        + '</div>'
        + '<div class="admin-list-title col">'
          + '<p class="list-text list-title">Request Title</p>'
        + '</div>'
        + '<div class="admin-list-date col">'
          + '<p class="list-text list-title">Date</p>'
        + '</div>'
        + '<div class="admin-list-status col">'
          + '<p class="list-text list-title">Status</p>'
        + '</div>'
      + '</div>'
    document.getElementById('list').appendChild(divCard);

    for (let i in data) {

      let request = data[i];
      date = request.req_date.split('T');
      console.log(date);
      app = '"approve(\''+request.request_number+'\',\''+request.title+'\',\''+request.isbn+'\')" ';
      rej ='"reject(\''+request.request_number+'\')" ';
      let divCard = document.createElement('div');
      let status ='';
      if(request.decision==null){
        status='<button type="button" class="button-list" onclick='+app +'>Approve</button>'
        +'<button type="button" class="button-list" onclick='+rej + '>Reject</button>'
      }
      else{
        let desc = 'approved'
        if(!request.decision)desc = 'rejected';
        text = `Admin ${request.last_name} ${desc} on ${request.desc_date.split('T')[0]}`
        status = '<p class="list-text">'+text+'</p>'
      }

      divCard.innerHTML += ""
      + '<div class="row">'
        + '<div class="admin-list-num col">'
          + '<p class="list-text">'+request.request_number+'</p>'
        + '</div>'
        + '<div class="admin-list-user col">'
          + '<p class="list-text">'+request.username+'</p>'
        + '</div>'
        + '<div class="admin-list-isbn col">'
          + '<p class="list-text">'+request.isbn+'</p>'
        + '</div>'
        + '<div class="admin-list-title col">'
          + '<p class="list-text">'+request.title+'</p>'
        + '</div>'
        + '<div class="admin-list-date col">'
          + '<p class="list-text">'+date[0]+'</p>'
        + '</div>'

        + '<div class="admin-list-status col">'
        + status
        + '</div>'

      + '</div>'
      document.getElementById('list').appendChild(divCard);
    }
}
function approve(num, title, isbn){
  obj = {"num": num, "title": title, "isbn": isbn}
  console.log(obj);
  localStorage.setItem('requestData', JSON.stringify(obj));
  window.location.href = '/inventory';
}

function reject(num){
  console.log("rejected " + num);
  reqObject = {"num": num, "desc": false}
  requestData('/decide', JSON.stringify(reqObject));
}
