let page = '';
function populateFilter(){

  populateFilterGroup("s");
  populateFilterGroup("e");
  setCurrDate();
}
function populateFilterGroup(type){
  dates = []
  for(i =1; i<=31; i++)dates.push(i);
  months = ["January", "February","March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  years = [2020]
  sMonth = document.getElementById(type+"Month");
  populateSelect(type+"Month", months)
  populateSelect(type+"Day", dates)
  populateSelect(type+"Year", years)
}

function populateSelect(id, data){
  for(i in data){
    let option = document.createElement("option");
    option.value = data[i];
    option.text = data[i];
    document.getElementById(id).appendChild(option);
  }
}

function setCurrDate(){
  var date = new Date();
  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = date.getFullYear();

  console.log(dd + " " + mm + " " + yyyy)
  $("#eMonth").val(months[parseInt(mm)-1]);
  $("#eDay").val(dates[parseInt(dd)-1]);
  $("#eYear").val(yyyy);
}

function filterDate(){
  let sMonth = document.getElementById('sMonth').selectedIndex+1;
  let sDay = document.getElementById('sDay').selectedIndex+1;
  let sYear = document.getElementById('sYear').value;
  let eMonth = document.getElementById('eMonth').selectedIndex+1;
  let eDay = document.getElementById('eDay').selectedIndex+1;
  let eYear = document.getElementById('eYear').value;
  sMonth = sMonth.toString().padStart(2, '0');
  sDay = sDay.toString().padStart(2, '0');
  eMonth = eMonth.toString().padStart(2, '0');
  eDay = eDay.toString().padStart(2, '0');

  start = `${sMonth}/${sDay}/${sYear}`;
  end = `${eMonth}/${eDay}/${eYear}`;
  let range = {"start": start, "end": end};
  //console.log(page);
  //console.log(range);
  if(page=="transactions"){
    init_transactions_data(range);
  }
  else{
    init_sales_data(range);
  }

}
