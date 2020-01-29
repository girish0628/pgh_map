
// let pittsburgh_hood;
let details_indicators = "White";

const threshold_arr = (indicator_val) =>{
  switch(indicator_val) {
    case "White":
      return [59.638, 81.206, 90.078, 96.100];
    case "Black":
      return [1.0, 2.632, 7.190, 27.166];
    case "Hispanic":
      return [0.500, 1.438, 3.480, 12.0];
    case "Adult 65+":
      return [10.836, 14.922, 18.414, 23.580];
    case "18-24 years":
      return [3.612, 5.592, 7.720, 11.850];
    case "Under 6 yrs":
      return [1.940, 3.690, 5.380, 7.958 ];
    case "Single parent":
      return [54.95, 72.66, 86.38, 95.94];
    case "Below poverty":
      return [3.37, 7.38, 13.10, 24.33];
    case "No high school":
      return [1.880, 4.110, 6.538, 10.814];
    case "Median income":
      return [34566.8, 47083.0, 58595.8, 76715.8];
    case "Renter Occupied Units":
      return [11.33, 25.54, 40.58, 59.84];
    case "Vacant Units":
      return [2.14, 6.45, 10.69, 18.07];
    case "Move after 2010":
      return [18.490, 26.604, 35.060, 45.486];
    case "Housing value":
      return [69460, 96720, 133120, 191520 ];
    case "Graduate":
      return [17.428, 26.764, 38.096, 55.658];
    case "Total population":
      return [648.8, 867.0, 1126.4, 1494.2];
    case "Low Response Score":
      return [10.2, 14.6, 18.7, 23.3];
    default:
      return [0, 20, 50, 90]
  }
}

// create icons for bus stop icons (selected and unselected)
const bus_stop_icon = L.icon({
  iconUrl: '../css/images/bus.png',
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
    "Pittsburgh Hood": '',
    "PGH City Council": '',
    "Bus Stops": '',
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
    dashArray: '3',
    fillOpacity: 0.7
   }
};
const bus_stop_marker = {
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
function indicators_cards(){
  $.getJSON("data/indicators_qa.json",indicators_qa=>{
    // muncipality = [...new Set(blkgrp_data.features.map(x => x.properties))]
});



}
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
  overlays["Pittsburgh Hood"].eachLayer(function (layer) {
    var feature = layer.feature;
      layer.setStyle(style(feature, indicator))

  });
}

const pgh_city_council = $.get("data/pgh_city_council.geojson");
const pittsburgh_hood = $.get("data/pittsburgh_hood.geojson");
const bus_routes = $.get("data/bus_routes.geojson");
const bus_stop = $.get("data/bus_stop.geojson");
const hacp_communities = $.get("data/hacp_communities.geojson");
const markers = L.markerClusterGroup({ chunkedLoading: true });

$.when(pgh_city_council, pittsburgh_hood, bus_routes, bus_stop, hacp_communities)
  .then((pgh_city_council, pittsburgh_hood, bus_routes, bus_stop, hacp_communities) => {
    overlays["Pittsburgh Hood"] = L.geoJson(pittsburgh_hood, {style: style,
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
          $('#geo-location').html(`${property.HOOD}`);
          $('.indicator-lbl-1').text(`${details_indicators}`);
          $('.indicator-percent-1').text(indicator_value);
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

    map.addLayer(overlays["Pittsburgh Hood"]);
    overlays["PGH City Council"] = L.geoJson(pgh_city_council, {style: pgh_city_council_style});


    overlays["Bus Routes"] = L.geoJson(bus_routes, {style: bus_routes_style});
    overlays["Bus Stops"] = L.geoJson(bus_stop, {
          pointToLayer: function (feature, latlng) {
          return markers.addLayer(L.marker(latlng, {icon: bus_stop_icon}));
          // return L.circleMarker(latlng, bus_stop_marker);
          }
        });
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
      if (feature.properties && feature.properties.Adresses) {
        layer.bindPopup(feature.properties.Adresses);
    }
  });

}