/*
The documentation on charts and sources for the function codes can be found here:
https://www.chartjs.org/docs/latest/
*/
let transactionChart='';
let salesRevChart='';
let expBrkChart = '';
let genreChart = '';
let authorChart = '';
let publisherChart = '';
let genreBrkChart = '';
let stockChart = '';
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
  var date = new Date();
  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = date.getFullYear();

  let start = '2020-01-01';
  let end = `${yyyy}-${mm}-${dd}`;
  let range = {"start": start, "end": end};
  requestSalesData("/allsales",'', range);
}

function init_sales_dashboard(){
  populateFilter();
  page = "sales";
  var date = new Date();
  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = date.getFullYear();

  let start = '2020-01-01';
  let end = `${yyyy}-${mm}-${dd}`;
  let range = {"start": start, "end": end};
  init_sales_data(range);
}

function init_sales_data(range){
  requestSalesData("/allsales",'', range);
  requestSalesData("genre","/salespercent/", range);
  requestSalesData("genre","/sales/", range);
  requestSalesData("publisher","/sales/", range);
  requestSalesData("author","/sales/", range);
  requestSalesData("","/numbers",range);
  requestSalesData("","/stock",range);
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
  for(i in newData){
    if(newData[i][labelKey]=="other"){
      newData[otherIndex][dataKey] = newData[otherIndex][dataKey].toFixed(2)
    }
  }

  return newData;
}
function requestSalesData(url,urlType, range){
  console.log(range);
  var request = $.ajax({
    url: "/sales/"+urlType+url,
    data: JSON.stringify(range),
    dataType: "json"
  });

  request.done(function (data) {

    var sales = JSON.parse(data);

    switch(urlType){
      case "":
        salesRevChart = renderSalesChart(sales, "date", "amount",  'salesChart', 'Revenue per day', renderLineChart,salesRevChart);
        break;
      case "/alltransactionsdaily":
        transactionChart = renderMultiChart(sales,  'chart', 'Transactions per day', transactionChart);
        break;
      case "/stock":
      console.log(sales);
        stockChart = renderSalesChart(sales, "date", "sum",  'stockChart', 'Stock per day', renderLineChart,stockChart);
        break;
      case "/salespercent/":

        sales = roundOther(1, sales,"name", "sold");
        genreBrkChart = renderSalesChart(sales, "name", "sold", url+'BreakdownChart', '', renderDoughnutChart, genreBrkChart);
        break;
      case "/sales/":
        switch(url){
          case "genre":
            genreChart = renderSalesChart(sales, "name", "sum", url+"Chart","Sales Per Genre", renderBarChart, genreChart);
            break;
          case "author":
            authorChart = renderSalesChart(sales, "name", "sum", url+"Chart","Sales Per Author", renderBarChart, authorChart);
            break;
          case "publisher":
            publisherChart = renderSalesChart(sales, "name", "sum", url+"Chart","Sales Per Publisher", renderBarChart, publisherChart);
            break;
        }
        break;
      case "/numbers":
        console.log(sales)
        expBrkChart = renderDoughnutChart(['publisher fees', 'other', 'restock'], [sales[0].publisher_fees, sales[0].other, sales[0].restock], "expBreakdownChart", 'Debit per expenditure', expBrkChart)
        document.getElementById('headerSales').innerHTML = sales[0].sold;
        document.getElementById('headerRev').innerHTML = "$"+parseFloat(sales[0].sales).toFixed(2);
        document.getElementById('headerProfit').innerHTML = "$"+parseFloat(sales[0].profit).toFixed(2);
        document.getElementById('headerExp').innerHTML ="$"+(-parseFloat(sales[0].expenditures).toFixed(2));
        break;

    }

  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")
  });

}

let renderDoughnutChart = function(labels, data, id, title, chart){

  var ctx = document.getElementById(id).getContext('2d');
  if(chart!=''){
    console.log("destorying dougnut")
    chart.destroy();
  }

  var chart = new Chart(ctx, {
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
  return chart;
}

let renderMultiChart = function(sales, id, title, chart){
  data1 = sales.sales.map(function (obj) {
    return obj["amount"];
  });

  let labels = sales.sales.map(function (obj) {
    return obj["date"];
  });

  let data2 = sales.expenditures.map(function (obj) {
    return obj["amount"];
  });
  document.getElementById(id).innerHTML = '<canvas id="myCanvas"></canvas>';
  var ctx = document.getElementById(id).getContext('2d');
  if(chart!=''){
    console.log("destorying multi")
    chart.destroy();
  }
    chart = new Chart(ctx, {
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
    return chart;

}

let renderBarChart = function(labels, data, id, title, chart){
  var ctx = document.getElementById(id).getContext('2d');
  console.log("chart is "+ chart)
  if(chart!=''){
    console.log("destorying bar")
    chart.destroy();
  }
  chart = new Chart(ctx, {
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

  return chart;

}

let renderLineChart = function(labels, data, id, title, chart){

  var ctx = document.getElementById(id).getContext('2d');
  if(chart!=''){
    console.log("destorying line")
    chart.destroy();
  }
  chart = new Chart(ctx, {
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
  return chart;

}
function renderSalesChart(sales, labelsKey, dataKey, id, title, func, chart){

  let labels = sales.map(function (obj) {
    return obj[labelsKey];
  });
  let data = sales.map(function (obj) {
    return obj[dataKey];
  });
  return func(labels, data, id, title, chart);


}
