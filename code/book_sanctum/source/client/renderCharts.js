

function getColors(opacity){
  colorList = [
    'rgba(209, 49, 0, $)',
    'rgba(255, 195, 11, $)',
    'rgba(255, 129, 11, $)',
    'rgba(153, 102, 255, $)',
    'rgba(204, 255, 153, $)',
    'rgba(102, 102, 255, $)',
    'rgba(255, 255, 0, $)',
    'rgba(102, 153, 255, $)',
    'rgba(102, 0, 102, $)',
    'rgba(0, 204, 153, $)',
    'rgba(128, 0, 0, $)',
    'rgba(153, 204, 0, $)',
    'rgba(255, 204, 255, $)',
    'rgba(153, 102, 51, $)',
    'rgba(255, 129, 11, $)',
    'rgba(102, 0, 51, $)',
    'rgba(255, 195, 11, $)',
    'rgba(102, 102, 153, $)',
    'rgba(209, 49, 0, $)',
    'rgba(102, 77, 0, $)',
  ]
  for(i in colorList){
    colorList[i] = colorList[i].replace('$', opacity);
  }
  return colorList;
}

function init_home(){
  requestSalesData("/allsales",'');
}
function init_sales_dashboard(){
  requestSalesData("/allsales",'');
  renderDoughnutChart(["Rent", "taxes", "publishers"], [20, 15, 65], "expBreakdownChart","");
  requestSalesData("genre","/salespercent/");
  requestSalesData("genre","/sales/");
  requestSalesData("publisher","/sales/");
  requestSalesData("author","/sales/");
  requestSalesData("","/saleSum");
  requestSalesData("","/profit");
}

function roundOther(val, data, labelKey, dataKey){
  newData = [];
  otherIndex = 0;
  for(i in data){
    if(data[i][dataKey]<val){
      if (!newData.some(e => e[labelKey] === 'other')) {
        temp = {};
        temp[labelKey] = "other";
        temp[dataKey] = 0;
        newData.push(temp);
        otherIndex = newData.length-1;
      }
      newData[otherIndex][dataKey] +=parseFloat(data[i][dataKey]);
    }
    else{
      newData.push(data[i]);
    }
  }
  newData[otherIndex][dataKey] = newData[otherIndex][dataKey].toFixed(2)
  return newData;
}
function requestSalesData(url,urlType){
  var request = $.ajax({
    url: "/sales/"+urlType+url,
    data: "query",
    dataType: "json"
  });

  request.done(function (data) {

    var sales = JSON.parse(data);

    switch(urlType){
      case "":
        renderSalesChart(sales, "order_date", "revenue",  'salesChart', 'Revenue per day', renderLineChart);
        break;
      case "/alltransactionsdaily":
        renderMultiChart(sales,  'chart', 'Transactions per day');
        break;
      case "/salespercent/":
        sales = roundOther(1, sales,"name", "sold");
        renderSalesChart(sales, "name", "sold", url+'BreakdownChart', '', renderDoughnutChart);
        break;
      case "/sales/":
        renderSalesChart(sales, "name", "sum", url+"Chart","Sales Per Genre", renderBarChart);
        break;
      case "/saleSum":
        document.getElementById('headerSales').innerHTML = sales[0].sum;
        break;
      case "/profit":
        console.log(sales)
        document.getElementById('headerRev').innerHTML = "$"+parseFloat(sales[0].revenue).toFixed(2);
        document.getElementById('headerProfit').innerHTML = "$"+parseFloat(sales[0].revenue-sales[0].expenditures).toFixed(2);
        document.getElementById('headerExp').innerHTML ="$"+parseFloat(sales[0].expenditures).toFixed(2);
        break;

    }

  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")
  });

}

let renderDoughnutChart = function(labels, data, id, title){
  var ctx = document.getElementById(id).getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: labels,
        datasets: [{
            label: title,
            data: data,
            backgroundColor: getColors(1),
            borderColor:getColors(1),
            borderWidth: 5
        }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
              position: 'left',
              align: "end",
              labels: {
                fontSize: 15,
              }
          }
      }
  });
}

let renderMultiChart = function(sales, id, title){

  let labels = sales.map(function (obj) {
    return obj["order_date"];
  });
  let data1 = sales.map(function (obj) {
    return obj["revenue"];
  });
  let data2 = sales.map(function (obj) {
    return obj["expenditures"];
  });
  var ctx = document.getElementById(id).getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: labels,
          datasets: [{
              label: "Revenue per day",
              data: data1,
              backgroundColor: 'rgba(209, 49, 0, 0.5)',
              borderColor: 'rgba(209, 49, 0, 1)',
              borderWidth: 1
          },
          {
              label: "Expenditures per day",
              data: data2,
              backgroundColor: 'rgba(255, 195, 11, 0.5)',
              borderColor: 'rgba(255, 195, 11, 1)',
              borderWidth: 1
          }]
      },
      options: {
        responsive: false,
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });

}

let renderBarChart = function(labels, data, id, title){
  var ctx = document.getElementById(id).getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: labels,
          datasets: [{
              label: title,
              data: data,
              backgroundColor: getColors(0.2),
              borderColor: getColors(1),
              borderWidth: 1
          }]
      },
      options: {
        responsive: false,
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });

}

let renderLineChart = function(labels, data, id, title){
  var ctx = document.getElementById(id).getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: labels,
          datasets: [{
              label: title,
              data: data,
              backgroundColor: getColors(0.1),
              borderColor: getColors(1),
              borderWidth: 1
          }]
      },
      options: {
        responsive: false,
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });

}
function renderSalesChart(sales, labelsKey, dataKey, id, title, func){

  let labels = sales.map(function (obj) {
    return obj[labelsKey];
  });
  let data = sales.map(function (obj) {
    return obj[dataKey];
  });
  func(labels, data, id, title);


}
