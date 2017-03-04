
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
  tableData = toArray(data); 

  set_main_table(main_table,tableData,cities);

  set_cities_table(cities,city_table);
  
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
  var travel_array=make_travel_array(); 
  for(var i = 1 ; i < travel_array.length ; i++){
    //alert(travel_array[i][0].toString()+" "+travel_array[i][1].toString()+" "+travel_array[i][2].toString()+" "+travel_array[i][3].toString());
    var flightPlanCoordinates = [
      {lat: parseFloat(travel_array[i][0]), lng: parseFloat(travel_array[i][1])},
      {lat: parseFloat(travel_array[i][2]), lng: parseFloat(travel_array[i][3])}
    ];

    var flightPath = new google.maps.Polyline({
      path: flightPlanCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: parseFloat(travel_array[i][4])+0.5
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