function toArray(data){
  var array = data.split("|")
  var re = [];
  for(var i = 0 ; i < array.length - 1 ; i++){
    re.push(array[i].split(";"));
  }
  return re;
}

function set_main_table(table,tableData,cities){

  while(table.rows.length>1)table.deleteRow(0);
  for(var i=0;i<tableData.length;i++){
    if(tableData[i][0] != ""){
      var newRow = table.insertRow(table.rows.length);

      var cell1 = newRow.insertCell(0);
      var cell2 = newRow.insertCell(1);
      var cell3 = newRow.insertCell(2);

      cell1.innerHTML = tableData[i][0];
      cell2.innerHTML = tableData[i][1];
      cell3.innerHTML = tableData[i][2];

      if(cities.indexOf(tableData[i][0]) == -1)cities.push(tableData[i][0]);
      if(cities.indexOf(tableData[i][1]) == -1)cities.push(tableData[i][1]);
    }
  }
}

function set_cities_table(){
	for(var i = 0 ; i < cities.length ; i++){
    var newRow = city_table.insertRow(city_table.rows.length);

    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);

    cell1.innerHTML = cities[i];
    get_coordinates(cities[i],cell2,cell3);
  }
}

function make_travel_array(){
  var travel_array=[[]];
  var coordinates1=[];
  var coordinates2=[];
  for(var i = 1 ; i < city_table.rows.length ; i++){
    var x = city_table.rows[i].cells;
    coordinates1.push(x[1].innerHTML);
    coordinates2.push(x[2].innerHTML);
  }
  var max=0;
  for(var i=0;i<tableData.length;i++){
  	var city1=tableData[i][0];
  	var city2=tableData[i][1];
  	if(city1<city2){var a=city1;city1=city2;city2=a;}
  	var coor11=coordinates1[cities.indexOf(city1)];
  	var coor12=coordinates2[cities.indexOf(city1)];
  	var coor21=coordinates1[cities.indexOf(city2)];
  	var coor22=coordinates2[cities.indexOf(city2)];
  	var was=-1;
  	for(var j=0;j<travel_array.length;j++){
  		var v=false;
  		if(travel_array[j][0]!=coor11)v=true;
  		if(travel_array[j][1]!=coor12)v=true;
  		if(travel_array[j][2]!=coor21)v=true;
  		if(travel_array[j][3]!=coor22)v=true;
  		if(v==false)was=j;
  	}
  	if(was==-1){
  		var new_line=[coor11,coor12,coor21,coor22,1];
  		travel_array.push(new_line);
  	}
  	else{
  		travel_array[was][4]++;
  		if(travel_array[was][4]>max)max=travel_array[was][4];
  	}
  }
  for(var i=0;i<travel_array.length;i++){
  	travel_array[i][4]*=7;
  	travel_array[i][4]/=max;
  }
  return travel_array;
}