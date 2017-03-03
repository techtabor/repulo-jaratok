window.onload = function() {
  var fileInput = document.getElementById('fileInput');
  var fileDisplayArea = document.getElementById('fileDisplayArea');

  fileInput.addEventListener('change',function(e) {
  var file = fileInput.files[0];
  var textType = /text.*/;
  var reader = new FileReader();

  reader.onload = function(e) {
    var data = reader.result;
    data = data.replace(/(?:\r\n|\r|\n)/g ,'|');
    set(data);
  }

  reader.readAsText(file);    
  });

}


function set(data){
  var tableData = toArray(data);
  var varosok = []; 
  var table = document.getElementById("main");

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

      if(varosok.indexOf(tableData[i][0]) == -1)varosok.push(tableData[i][0]);
      if(varosok.indexOf(tableData[i][1]) == -1)varosok.push(tableData[i][1]);
    }
  }

  var cities=document.getElementById("cities");

  for(var i = 0 ; i < varosok.length ; i++){
    var newRow = cities.insertRow(cities.rows.length);

    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);

    cell1.innerHTML = varosok[i];
    get_coordinates(varosok[i],cell2,cell3);
  }
}

function toArray(data){
  var array = data.split("|")
  var re = [];
  for(var i = 0 ; i < array.length - 1 ; i++){
    re.push(array[i].split(";"));
  }
  return re;
}

function get_coordinates(name,cell1,cell2){ 
  var geocoder =  new google.maps.Geocoder();

  geocoder.geocode( { 'address': name}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var a = results[0].geometry.location.lat();
      var b = results[0].geometry.location.lng();

      cell1.innerHTML = a;
      cell2.innerHTML = b;
    }
  });
}


function set_map(locations){
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
    center: new google.maps.LatLng(47.497, 19.040),
    mapTypeId: 'terrain'
  });

  var infowindow = new google.maps.InfoWindow();
  var marker, i;

  for (i = 0; i < locations.length; i++) {

    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][1], locations[i][2]),
      map: map
    });

    google.maps.event.addListener(marker, 'click', (function(marker, i) {
      return function() {
        infowindow.setContent(locations[i][0]);
        infowindow.open(map, marker);
      }
    })(marker, i));
  }

  var vars1 = [];
  var vars2 = [];
  var dar = [];
  var maxdar = 1;
  var table = document.getElementById("main");
  
  for(var i = 1 ; i < table.rows.length ; i++){
    var x = table.rows[i].cells;
    var str1 = x[0].innerHTML;
    var str2 = x[1].innerHTML;
    if(str1 > str2){
      var pot = str1;
      str1 = str2;
      str2 = pot;
    }
    if(vars1.indexOf(str1) == -1){
      vars1.push(str1);
      vars2.push(str2);
      dar.push(1);
    }
    else{
      var van =- 1;
      for(var j = 0 ; j < vars1.length ; j++){
        if(vars1[j] == str1 && vars2[j] == str2) van = j;
      }
      if(van == -1){
        vars1.push(str1);
        vars2.push(str2);
        dar.push(1);
      }
      else{
        dar[j] += 1;
        if(dar[j] > maxdar)maxdar = dar[j];
      }
    }
  }

  var ci = [];
  var k1 = [];
  var k2 = [];
  var table2 = document.getElementById("cities");

  for(var i = 1 ; i < table2.rows.length ; i++){
    var x = table2.rows[i].cells;
    ci.push(x[0].innerHTML);
    k1.push(x[1].innerHTML);
    k2.push(x[2].innerHTML);
  }

  var keszAdatok = [[]];
  for(var i = 0 ; i < vars1.length ; i++){
    var ujSor = [];

    ujSor.push(k1[ci.indexOf(vars1[i])]);
    ujSor.push(k2[ci.indexOf(vars1[i])]);
    ujSor.push(k1[ci.indexOf(vars2[i])]);
    ujSor.push(k2[ci.indexOf(vars2[i])]);

    var alk = 0.1;
    alk = parseInt(dar[i]) / parseInt(maxdar) * 6;

    if(isNaN(alk))alk = 1;
    ujSor.push(alk);
    
    keszAdatok.push(ujSor);
  }

  for(var i = 1 ; i < keszAdatok.length ; i++){
    var alkk = 1.1;
    alkk = keszAdatok[i][0];

    var flightPlanCoordinates = [
      {lat: parseFloat(keszAdatok[i][0]), lng: parseFloat(keszAdatok[i][1])},
      {lat: parseFloat(keszAdatok[i][2]), lng: parseFloat(keszAdatok[i][3])}
    ];

    var flightPath = new google.maps.Polyline({
      path: flightPlanCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: parseFloat(keszAdatok[i][4])+0.5
    });

    flightPath.setMap(map);
  }
}

function show_map(){
  var tomb=[[]];
  var table = document.getElementById("cities");
  for(var i=1;i<table.rows.length;i++){
    var x = table.rows[i].cells;
    var t=[x[0].innerHTML,parseFloat(x[1].innerHTML),parseFloat(x[2].innerHTML),2];
    tomb.push(t);
  }
  set_map(tomb);
}

function reload_button()
  {
  var table = document.getElementById("cities");
  for(var i=1;i<table.rows.length;i++)
  {
    var x = document.getElementById("cities").rows[i].cells;
    if(x[1].innerHTML==""){
      get_coordinates(x[0].innerHTML,x[1],x[2]);
    }
  }
}