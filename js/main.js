
// let pittsburgh_hood;
let details_indicators = "White";
let hacp_communities_marker, hospitals_marker, grocery_marker, bus_stop_marker, marker_zoom = 13;
let hospitals_ids = "", grocery_ids = "", bus_stop_ids = "";
const threshold_arr = (indicator_val) =>{
  switch(indicator_val) {
    case "White":
      return [26.77000, 61.96798, 74.80382, 84.27372];
    case "Black":
      return [5.125296, 10.378930, 31.222578, 65.246184];
    case "Hispanic":
      return [0.5685608, 1.8745417, 2.6076115, 3.7038109];
    case "Adult 65+":
      return [10.68706, 12.73242, 15.25285, 18.33191];
    case "18-24 years":
      return [5.622745, 7.729640, 10.160014, 13.813545];
    case "Under 6 yrs":
      return [2.449595, 4.024039, 6.142116, 7.453966];
    case "Single parent":
      return [47.86160, 59.89031, 72.27431, 83.89457];
    case "Below poverty":
      return [12.20992, 17.28467, 24.24932, 34.63026];
    case "No high school":
      return [5.114027, 7.577430 , 9.864903, 14.127499];
    case "Renter Occupied Units":
      return [31.54139, 48.33985, 57.69136, 70.29030];
    case "Vacant Units":
      return [6.70697, 11.02293, 16.01130, 20.85960];
    case "Move after 2010":
      return [27.73759, 36.03926, 42.61636, 55.29848];
    case "Graduate":
      return [12.16435, 21.82644, 34.79515, 50.00000];
    case "Total population":
      return [938.4, 1885.4, 3114.2, 5577.6];
    default:
      return [0, 20, 50, 90]
  }
}

// create icons for grocery icons (selected and unselected)
const grocery_icon = L.icon({
  iconUrl: '../css/images/grocery.png',
  iconSize: [20, 20]
});
// create icons for bus stop icons (selected and unselected)
const bus_stop_icon = L.icon({
  iconUrl: '../css/images/bus.png',
  iconSize: [20, 20]
});
// create icons for bus stop icons (selected and unselected)
const hospitals_icon = L.icon({
  iconUrl: '../css/images/hospital.png',
  iconSize: [20, 20]
});
// create icons for bus stop icons (selected and unselected)
const hacp_icon = L.icon({
  iconUrl: '../css/images/hacp1.png',
  iconSize: [24, 24]
});
const color_council = ['#f56942', '#f542a7', '#fa2d2d', '#9ca7c3', '#b88db8', '#fcf18f', '#ade1ad',
                       '#8dc4c2', '#9ca7c3', '#a17ea8','#4287f5', '#42e3f5', '#42f587', '#d7f542', '#f5aa42'];
const grayscale  = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
        streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr}),
         osm_lyr = L.tileLayer( osm_url, {attribution: '' + mapLink + ' Contributors', maxZoom: maxZoom,});
const base_layers = {
          "Grayscale": grayscale,
          "Streets": streets,
          "OSM": osm_lyr
          };
const overlays = {
    "City of Pittsburgh Neighborhoods": '',
    "City of Pittsburgh Council Districts": '',
    // "Bus Stops": '',
    "Bus Routes": '',
    "HACP Communities": ''
    };

const map = L.map('map', {
  center: center,
  zoom: zoom,
  attributionControl: false,
  layers: [osm_lyr]
});

const pgh_city_council_style = feature => {
  return{
    weight: 2,
    opacity: 1,
    color: '#fa2d2d',
    // dashArray: '3',
    fillOpacity: 0.7
   }
};
const bus_stop_style = {
  radius: 3,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};
const bus_routes_style = feature => {
  return{
    weight: 2,
    opacity: 1,
    color: '#4287f5',
    dashArray: '3',
    fillOpacity: 0.7
   }
};
const style = (feature, indicator="White") =>{
	return {
    fillColor: d3.scaleThreshold()
        .domain(threshold_arr(indicator))
        .range(color_array)(feature.properties[indicator]),
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7
	};
}

function indicator_compare(hood_name, indicator_attrib){

  // var hood_name = ["Ross township", "West Deer township", "Wilkinsburg borough"];
  var arr_obj = [], final_arr = [];
     for(var i=0; i < hood_name.length; i++){

      var indicator_data = hood.filter(({HOOD}) => HOOD === hood_name[i])
                            // .filter(obj =>obj[indicator_attrib] !== null)
                            .sort((a, b) => (a[indicator_attrib] > b[indicator_attrib]) ? 1 : -1)
                            .slice(0,3);
      arr_obj.push(indicator_data);
     }
    for(var i=0; i < arr_obj.length; i++){
      //debugger;
      var obj = {};
      for(var j=0; j < arr_obj[i].length; j++){
        obj[hood_name[j]] = arr_obj[i][j][indicator_attrib].toFixed(3);
      }
          final_arr.push(obj)
    }
    return [...final_arr];
}

var indicator_arr;
$.getJSON("data/indicators_qa.json",indicators_qa=>{
  indicator_arr = indicators_qa;
});

function generateTableHead(table, data) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let key of data) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}
function generateTable(table, data) {
  for (let element of data) {
    let row = table.insertRow();
    for (key in element) {
      let cell = row.insertCell();

      var btn = document.createElement('input');
          btn.type = "button";
          btn.className = "btn btn-indicator-rnk";
          btn.value = element[key] ? element[key]: 'No Data';

      // let text = document.createTextNode(element[key]);
      // cell.appendChild(text);
      cell.appendChild(btn);
    }
  }
}
// function indicators_cards(){
//   $.getJSON("data/indicators_qa.json",indicators_qa=>{
//     // muncipality = [...new Set(blkgrp_data.features.map(x => x.properties))]
// });}
function indicator_back(){
  $('#indicator-demographic').toggleClass('d-none');
  $('.demo-content').toggleClass('d-none');
}
function indicator_content(indicator_label, indicator_name){
    $('#indicator-demographic').toggleClass('d-none');
    $('.demo-content').toggleClass('d-none');
    $('#indicator-definition').html('');
    $('#indicator-connection').html('')
    $('#indicator-definition').html(indicator_arr[indicator_name].find((m)=>m["v_label"] === indicator_label).definition);

}
function rank_content(obj){
  $('#indicators-content').toggleClass('d-none');
  $('#indicator-res').toggleClass('d-none');
  var boroughs_arr = $('#input-tags').get(0).selectize.getValue();
  var indicators_arr = $('#variables').get(0).selectize.getValue().split(',');

  for(var i=0; i < indicators_arr.length; i++){
    var data_obj = indicator_compare(boroughs_arr.split(','), indicators_arr[i]);

    var data = Object.keys(data_obj[0]);
    generateTableHead( $('#table')[0], boroughs_arr.replace(/ borough/g, '').split(','));
    generateTable($('#table')[0], data_obj);
    var variable = variables.filter(({variable, label}) => variable === indicators_arr[i])[0].label
    generateTableHead( $('#table')[0], ['Variable Name: ', variable, '']);
  }

}

function rank_back(){
  $('#indicators-content').toggleClass('d-none');
  $('#indicator-res').toggleClass('d-none');
  $('#table').empty();
}


$('.dropdown-menu').click(function(e) {
  e.stopPropagation();
});

let domain_arr = [];
const color_array = ['#fcf18f', '#ade1ad', '#8dc4c2', '#9ca7c3', '#a17ea8'];
function uniqueId(){
  return Math.floor(Math.random() * 26) + Date.now()
}

function close_panel(obj){
  obj.parentElement.classList[2] === "show" ? obj.parentElement.classList.remove("show"): obj.parentElement.parentElement.classList.remove("show");
}
function collapseCard(obj){
  let id = $(obj).attr("datatarget");
  $(id).toggleClass("show")
}
function createContainer(...args){
  var id = uniqueId();
  var main_container = {
    id: `${id}`,
    class: `class-${id}`,
    css: {
      "height": `${args[0]}px`,
      "width": `${args[1]}px`,
      "display": "flex",
      "background-color": "blue",
    }
  };
  var $main_container = $("<div>", main_container);
  // $div.html("New Division");
  $(args[2]).append($main_container);

  color_array.map((color, index)=>{
    var box = {
      id: `${index}${uniqueId()}`,
      class: `class-${index}${uniqueId()}`,
      css: {
        "height": `${args[0]}px`,
        "width": `${args[1]/color_array.length}px`,
        "background-color": color,
      }
    };

    var $box = $("<div>", box);
        $(`#${id}`).append($box);
  });
}
createContainer(40, 200, "#container");

const reSetStyle = (indicator) =>{
  details_indicators = indicator;
  overlays["City of Pittsburgh Neighborhoods"].eachLayer(function (layer) {
    var feature = layer.feature;
      layer.setStyle(style(feature, indicator))

  });
}

const pgh_city_council = $.get("data/pgh_city_council.geojson");
const pittsburgh_hood = $.get("data/pittsburgh_hood.geojson");
const bus_routes = $.get("data/bus_routes.geojson");
// const bus_stop = $.get("data/bus_stop.geojson");
const hacp_communities = $.get("data/hacp_communities.geojson");
const markers = L.markerClusterGroup({ chunkedLoading: true });
const hospitalGroup = L.layerGroup().addTo(map);
const groceryGroup = L.layerGroup().addTo(map);
const busStopGroup = L.layerGroup().addTo(map);

$.when(pgh_city_council, pittsburgh_hood, bus_routes, hacp_communities)
  .then((pgh_city_council, pittsburgh_hood, bus_routes, hacp_communities) => {
    addListCommunities(hacp_communities);
    overlays["City of Pittsburgh Neighborhoods"] = L.geoJson(pittsburgh_hood, {style: style,
      onEachFeature: function (feature, layer) {
        layer.on('click', function () {
          var property = feature.properties;
          var indicator_txt_bar = `${(feature.properties[details_indicators]).toFixed(2)}`;
          var indicator_value = ''
         if((details_indicators === "Median income") || (details_indicators === "Housing value")){
          indicator_value = `$${indicator_txt_bar}`;
         }else{
          indicator_value = `${indicator_txt_bar}%`;
         }
          $('#details').addClass("show");
          $('#details > .details-header')[0].innerHTML = `${property.HOOD}`;
          // $('#geo-location').html(`${property.HOOD}`);
          // $('.indicator-lbl-1').text(`${details_indicators}`);
          // $('.indicator-percent-1').text(indicator_value);
          $('.line-bar-txt').text(`${indicator_txt_bar}`);
          $('.indicator-percent-2').text(`${property["Total population"]}`);
          $('.indicator-percent-3').text(`${property["White"].toFixed(2)}`);
          var interval_indicator = 0;
                threshold_arr(details_indicators).map((indi, index) =>{
                  property[details_indicators] < indi ? interval_indicator = (index + 1) * 40 : null;
                });

                $("#line-bar").css("margin-left", `${Math.round(interval_indicator)}px`);

        });
      }
    });

    map.addLayer(overlays["City of Pittsburgh Neighborhoods"]);
    overlays["City of Pittsburgh Council Districts"] = L.geoJson(pgh_city_council, {style: pgh_city_council_style});


    overlays["Bus Routes"] = L.geoJson(bus_routes, {style: bus_routes_style});
    // overlays["Bus Stops"] = L.geoJson(bus_stop, {
    //       pointToLayer: function (feature, latlng) {
    //       return markers.addLayer(L.marker(latlng, {icon: bus_stop_icon}));
    //       // return L.circleMarker(latlng, bus_stop_marker);
    //       }
    //     });
    overlays["HACP Communities"] = L.geoJson(hacp_communities, {
          pointToLayer: function (feature, latlng) {
          return L.marker(latlng, {icon: hacp_icon});
          },
          onEachFeature: onClickCommunities
        });
    /** Added control to map */
    L.control.layers(base_layers, overlays).addTo(map);
    map.zoomControl.setPosition('bottomright');
    map.whenReady(()=>$('#cover').fadeOut(1000));

  });
  var popup = L.popup()
  .setLatLng(center)
  .setContent("I am a standalone popup.")
  // .openOn(map);

  function onClickCommunities(feature, layer) {
    layer.on('click', function (e) {
      if (feature.properties && feature.properties.Addresses) {
        layer.bindPopup(feature.properties.Addresses);
    }
  });

}

function addListCommunities(hacp_communities_data){
  const hacp_communities = [...new Set(hacp_communities_data[0].features.map(x => x.properties))];
    $.each(hacp_communities, function(val, text) {
        $('#hacp_list').append(`<li onclick="addMarker(${text.Latitude}, ${text.Longitude}, '${text.hospitals}', '${text.grocery}', '${text.bus_stop}')" class="dropdown-item hacp-list">${text.Addresses.split(',')[0]}</li>`);
    });
}
function addMarker(lat, lng, hospitals_id, grocery_id, bus_stop_id){
  hospitals_ids = hospitals_id;
  grocery_ids = grocery_id;
  bus_stop_ids = bus_stop_id;

  if(hospitalGroup) hospitalGroup.clearLayers();
  if(groceryGroup) groceryGroup.clearLayers();
  if(busStopGroup) busStopGroup.clearLayers();
  $("#hospital-marker").removeClass("select-marker");
  $("#grocery-marker").removeClass("select-marker");
  $("#bus-stop-marker").removeClass("select-marker");

  $(".dropdown-menu").removeClass('show');
  if(hacp_communities_marker) hacp_communities_marker.remove();
  if(hospitals_marker) hospitals_marker.remove();
  hacp_communities_marker = L.marker([lat, lng]).addTo(map);
  map.flyTo([lat, lng], marker_zoom);
  $('#hacp_list').focus();
  return false;
}

const hospitals = $.get("data/hospital.geojson");
const grocery = $.get("data/grocerystore.geojson");
const bus_stop = $.get("data/bus_stop.geojson");
let hospitals_data;
$.when(hospitals, grocery, bus_stop)
      .then((hospitals, grocery, bus_stop) => {
          hospitals_data = hospitals;
          grocery_data = grocery;
          bus_stop_data = bus_stop;
      });
function hospitalMarkers(){
  $("#hospital-marker").toggleClass("select-marker");
  if (!$('#hospital-marker').hasClass('select-marker')){
    return hospitalGroup.clearLayers();
  }
    let ids_array = hospitals_ids.toString().split(',');
        hospitals_marker = L.geoJson(hospitals_data, {
          pointToLayer: function (feature, latlng) {
            if(ids_array.includes(feature.properties.id.toString())){
                return L.marker(latlng, {icon: hospitals_icon}).addTo(hospitalGroup);
              }
          }
        });
  }
  function groceryMarkers(){
    $("#grocery-marker").toggleClass("select-marker");
    if (!$('#grocery-marker').hasClass('select-marker')){
      return groceryGroup.clearLayers();
    }
  let ids_array = grocery_ids.toString().split(',');
      grocery_marker = L.geoJson(grocery_data, {
        pointToLayer: function (feature, latlng) {
              if(ids_array.includes(feature.properties.id.toString())){
                  return L.marker(latlng, {icon: grocery_icon}).addTo(groceryGroup);
                }
            }
          });
    }
  function busStopMarkers(){
    $("#bus-stop-marker").toggleClass("select-marker");
    if (!$('#bus-stop-marker').hasClass('select-marker')){
      return busStopGroup.clearLayers();
    }
  let ids_array = bus_stop_ids.toString().split(',');
      bus_stop_marker = L.geoJson(bus_stop_data, {
          pointToLayer: function (feature, latlng) {
              if(ids_array.includes(feature.properties.id.toString())){
                  // return L.marker(latlng, {icon: bus_stop_icon}).addTo(busStopGroup);
                  return L.marker(latlng, {icon: bus_stop_icon}).addTo(busStopGroup);
                }
            }
          });
    }