// $('.close').on('click', function(){
//   $('#details').removeClass("show");
 
//   $('#close').toggleClass('active');
// });
var indicator_arr;
$.getJSON("data/indicators_qa.json",indicators_qa=>{
  indicator_arr = indicators_qa;
});

let mountains = [
  { name: "Monte Falco", height: 1658, place: "Parco Foreste Casentinesi" },
  { name: "Monte Falterona", height: 1654, place: "Parco Foreste Casentinesi" },
  { name: "Poggio Scali", height: 1520, place: "Parco Foreste Casentinesi" },
  { name: "Pratomagno", height: 1592, place: "Parco Foreste Casentinesi" },
  { name: "Monte Amiata", height: 1738, place: "Siena" }
];
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
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
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

  // // $.getJSON("data/indicators_qa.json",indicators_qa=>{
    // indicator_arr = indicators_qa[indicator_name]
    $('#indicator-demographic').toggleClass('d-none'); 
    $('.demo-content').toggleClass('d-none');
    $('#indicator-definition').html('');
    $('#indicator-conection').html('')
    $('#indicator-definition').html(indicator_arr[indicator_name].find((m)=>m["v_label"] === indicator_label).definition);
    // $('#indicator-conection').html(indicator_arr[indicator_name].find((m)=>m["v_label"] === indicator_label).connection);

  // });

}
function rank_content(obj){
  $('#indicators-content').toggleClass('d-none');
  $('#table').toggleClass('d-none');
  
 obj.innerHTML === 'Submit'? obj.innerHTML = '<i class="fa fa-angle-left"> Back</i>': obj.innerHTML = 'Submit'

  // let table = document.querySelector("table");
  let data = Object.keys(mountains[0]);
    generateTableHead( $('#table')[0], data);
    generateTable($('#table')[0], mountains);

}

$('.dropdown-menu').click(function(e) {
  e.stopPropagation();
});

let domain_arr = [];
const color_council = ['#f56942', '#f542a7', '#fa2d2d', '#9ca7c3', '#b88db8', '#fcf18f', '#ade1ad', '#8dc4c2', '#9ca7c3', '#a17ea8','#4287f5', '#42e3f5', '#42f587', '#d7f542', '#f5aa42'];

function uniqueId(){
  return Math.floor(Math.random() * 26) + Date.now()
}

function close_panel(obj){
  obj.parentElement.classList.remove("show");
  
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

  color_council.map((color, index)=>{
  
    var box = {
      id: `${index}${uniqueId()}`,
      class: `class-${index}${uniqueId()}`,
      css: {
        "height": `${args[0]}px`,
        "width": `${args[1]/color_council.length}px`,         
        "background-color": color,
      }
    };

    var $box = $("<div>", box);
        $(`#${id}`).append($box);
  });  
}
createContainer(40, 200, "#container");
createContainer(20, 100, "#poverty");
createContainer(20, 100, "#poverty-new");
createContainer(20, 100, "#white");
createContainer(20, 100, "#white-new");


function style(feature) {
 
	return {
		fillColor: d3.scaleQuantize()
              .domain(domain_arr)
              .range(color_council)(feature.properties.District),
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7
	};
}

var allegheny_county_council = $.get("data/allegheny_county_council.geojson");
var allegheny_county_school = $.get("data/allegheny_county_school.geojson");
var pgh_city_council = $.get("data/pgh_city_council.geojson");

$.when(allegheny_county_council, allegheny_county_school, pgh_city_council)
    .done(function(council_data, school_data, city_data) {

        domain_arr = [d3.min(council_data[0].features, function(d) { return d.properties.District; }), 
                d3.max(council_data[0].features, function(d) { return d.properties.District; })];
      
      var council_lyr = L.geoJson(council_data, {style:  
              function(feature){  return{
                                        fillColor: d3.scaleQuantize()
                                                  .domain(domain_arr)
                                                  .range(color_council)(feature.properties.District),
                                        weight: 2,
                                        opacity: 1,
                                        color: 'white',
                                        dashArray: '3',
                                        fillOpacity: 0.7
                                       }}}); 


      var school_lyr  = L.geoJson(school_data,  {style: 
                function(feature){ return{
                                      fillColor: d3.scaleQuantize()
                                                .domain(domain_arr)
                                                .range(color_council)(feature.properties.OBJECTID),
                                      weight: 2,
                                      opacity: 1,
                                      color: 'white',
                                      dashArray: '3',
                                      fillOpacity: 0.7
                                    }}});
      var city_lyr    = L.geoJson(city_data,    {style: 
              function(feature){ return{
                                        fillColor: d3.scaleQuantize()
                                                  .domain(domain_arr)
                                                  .range(color_council)(feature.properties.council),
                                        weight: 2,
                                        opacity: 1,
                                        color: 'white',
                                        dashArray: '3',
                                        fillOpacity: 0.7
                                      }}});

      var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
          streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr}),
          osm_lyr = L.tileLayer( osm_url, {attribution: '&copy; ' + mapLink + ' Contributors', maxZoom: maxZoom,});

      var map = L.map('map', {
                center: center,
                zoom: zoom,
                attributionControl: false,
                layers: [streets, council_lyr, school_lyr, city_lyr]
              });
        map.zoomControl.setPosition('bottomright');
      var baseLayers = {
        "Grayscale": grayscale,
        "Streets": streets,
        "OSM": osm_lyr
        };

      var overlays = {
            "Allegheny County Council": council_lyr,
            "Allegheny County School": school_lyr,
            "PGH City Council": city_lyr
        };

        L.control.layers(baseLayers, overlays).addTo(map);
    });



 // load GeoJSON from an external file
//  $.getJSON("data/allegheny_county_council.geojson",allegheny_council_data=>{
//   domain_arr = [d3.min(allegheny_council_data.features, function(d) { return d.properties.District; }), 
//                 d3.max(allegheny_council_data.features, function(d) { return d.properties.District; })];



//   var allegheny_county_council = L.geoJson(allegheny_council_data, {style: style,});

// var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
//     streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr}),
//     osm_lyr = L.tileLayer( osm_url, {attribution: '&copy; ' + mapLink + ' Contributors', maxZoom: maxZoom,});


// var map = L.map('map', {
// 		center: center,
//     zoom: zoom,
//     attributionControl: false,
// 		layers: [streets, allegheny_county_council]
//   });
  
//   map.zoomControl.setPosition('bottomright');
// var baseLayers = {
// 	"Grayscale": grayscale,
//   "Streets": streets,
//   "OSM": osm_lyr
// 	};

// var overlays = {
//       "Allegheny County Council": allegheny_county_council
// 	};

//   L.control.layers(baseLayers, overlays).addTo(map);
 
// });