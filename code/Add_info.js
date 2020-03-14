//var csv is the CSV file with headers
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
fs = require("fs");
var csv = require('csv-parser');
const { Pool, Client } = require("pg");
let http = require('http')

const port = 3000;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "book_sanctum",
  password: "2552",
  port: "5432"
});



function readJSON(paths){
  data = {};
  for(key in paths){
    const currData = fs.readFileSync(paths[key]);
    data[key] = JSON.parse(currData.toString());

  }

  //console.log(data["in"].length);
  for (i in data["out"]){
    //console.log(data["in"][i])
    if(data["out"][i]["rating"]==0){
      getBookSync(data["out"],i,paths["out"]);
      return;
    }
  }
}

function getBookSync(data, i, path){
  var url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${data[i]["isbn13"]}`;
  console.log(url);
  var request = require('sync-request');
  var res = request('GET', url);

  var google = JSON.parse(res.getBody());

  if(google["totalItems"]==0){
    data[i]["description"] ="REMOVE";
    data[i]["rating"] = -1;
    data[i]["rating_count"] = -1;
    data[i]["price"] = -1;

  }
  else{
    //console.log("parsed data for " + JSON.stringify(google["items"][0]["volumeInfo"]["description"]));
    googleData = google["items"][0]["volumeInfo"];
    if("description" in googleData){
      data[i]["description"] = googleData["description"];
    }
    else{
      data[i]["description"] = "REMOVE";
    }

    if("ratingsCount" in googleData){
      data[i]["rating_count"] = googleData["ratingsCount"];
    }
    else{
      data[i]["rating_count"] = -1;
    }

    if("averageRating" in googleData){
      data[i]["rating"] = googleData["averageRating"];
    }
    else{
      data[i]["rating"] = -1;
    }

    if("publishedDate" in googleData){
      data[i]["published_date"] = googleData["publishedDate"];
    }

    let priceFound = false;

    if("saleInfo" in googleData){
      if("listPrice" in googleData["saleInfo"]){
        data[i]["price"] = googleData["saleInfo"]["listPrice"]["amount"];
        priceFound = true;
      }
      else if("retailPrice" in googleData["saleInfo"]){
        data[i]["price"] = googleData["saleInfo"]["retailPrice"]["amount"];
        priceFound = true;
      }

    }

    if(!priceFound){
      data[i]["price"] = -1;
    }

  }
  saveJSON(data,path);


}
function getBookURL(data,i,path){
  //https://www.googleapis.com/books/v1/volumes?q=isbn:9780553573428

  var url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${data[i]["isbn13"]}`;
  console.log(url);
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //console.log(typeof this.responseText);
      var google = JSON.parse(this.responseText);
      if(google["totalItems"]==0){
        data[i]["description"] ="REMOVE";
        data[i]["rating"] = -1;
        data[i]["rating_count"] = -1;
        data[i]["price"] = -1;

      }
      else{
        //console.log("parsed data for " + JSON.stringify(google["items"][0]["volumeInfo"]["description"]));
        googleData = google["items"][0]["volumeInfo"];
        if("description" in googleData){
          data[i]["description"] = googleData["description"];
        }
        else{
          data[i]["description"] = "REMOVE";
        }

        if("ratingsCount" in googleData){
          data[i]["rating_count"] = googleData["ratingsCount"];
        }
        else{
          data[i]["rating_count"] = -1;
        }

        if("averageRating" in googleData){
          data[i]["rating"] = googleData["averageRating"];
        }
        else{
          data[i]["rating"] = -1;
        }

        if("publishedDate" in googleData){
          data[i]["published_date"] = googleData["publishedDate"];
        }

        let priceFound = false;
        if("saleInfo" in googleData){
          if("listPrice" in googleData["saleInfo"]){
            data[i]["price"] = googleData["saleInfo"]["listPrice"]["amount"];
            priceFound = true;
          }
          else if("retailPrice" in googleData["saleInfo"]){
            data[i]["price"] = googleData["saleInfo"]["retailPrice"]["amount"];
            priceFound = true;
          }

        }

        if(!priceFound){
          data[i]["price"] = -1;
        }

      }
      saveJSON(data,path);

    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}





function saveJSON(data,filename){

  fs.writeFileSync(filename, JSON.stringify(data,null,2));
  console.log("The file was saved!");


}

var args = process.argv.slice(2);

iterations = parseInt(args[0]);
console.log(iterations);

for(let i =0; i<iterations; i++){
  var start = new Date().getTime();

  paths = {
  "in": "../data/Full_Data2/full_books.json",
  "out": "../data/Full_Data2/full_info.json",
  }
  //val = readCSV("../../book-depository-dataset/google_books_1299.csv",paths);
  readJSON(paths);
  var end = new Date().getTime();
  var time = end - start;
  console.log("time it took was " + time + " miliseconds");
}
//console.log(val);
//for run in {1..100}; do node Add_info.js; sleep 1; done
