var center = [40.447500, -79.987661],
    zoom = 11,
    mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>',
    mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
    maxZoom = 18,
    osm_url = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    footer_box_1 = 'Description of indicators',
    footer_box_2 = 'Details via charts and descriptive data',
    footer_box_3 = '';