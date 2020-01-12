$('#cover').fadeOut(1000);
// create icons for bus stop icons (selected and unselected)
var bus_stop_icon = L.icon({
  iconUrl: '../css/images/bus.png',
  iconSize: [10, 10]
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
    "Bus Routes": ''
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
const style = (feature) =>{
  return{
    fillColor: '#f56942',
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
   }
}

// const allegheny_county_council = $.get("data/allegheny_county_council.geojson");
// const allegheny_county_school = $.get("data/allegheny_county_school.geojson");
const pgh_city_council = $.get("data/pgh_city_council.geojson");
const pittsburgh_hood = $.get("data/pittsburgh_hood.geojson");
const bus_routes = $.get("data/bus_routes.geojson");
const bus_stop = $.get("data/bus_stop.geojson");

$.when(pgh_city_council, pittsburgh_hood, bus_routes, bus_stop)
  .then((pgh_city_council, pittsburgh_hood, bus_routes, bus_stop) => {
    overlays["PGH City Council"] = L.geoJson(pgh_city_council, {style: pgh_city_council_style});
    overlays["Pittsburgh Hood"] = L.geoJson(pittsburgh_hood, {style: style});
    overlays["Bus Routes"] = L.geoJson(bus_routes, {style: bus_routes_style});
    overlays["Bus Stops"] = L.geoJson(bus_stop, {
          pointToLayer: function (feature, latlng) {
          return L.marker(latlng, {icon: bus_stop_icon});
          // return L.circleMarker(latlng, bus_stop_marker);
          }
        });
    /** Added control to map */
    L.control.layers(base_layers, overlays).addTo(map);

  });