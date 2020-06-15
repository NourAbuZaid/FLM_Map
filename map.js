
/////////////////////////
// -------- RENDERING MAP
/////////////////////////
// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = "pk.eyJ1Ijoibm91cmFidXphaWQiLCJhIjoiY2p5MnRpbDNiMGxiZzNlazIzbW5wMXYzbiJ9.hyfX_xW01YzBBWv2o-G1FA";
//Setup mapbox-gl map
var map = new mapboxgl.Map({
  container: 'map',
  style: "mapbox://styles/nourabuzaid/ckb6hjbdb2l1n1hp7dijmzp18/draft", 
  center: [40, 27], // starting position [lng, lat] [31.9466, 35.3027]
  zoom: 5 // starting zoom
});

map.scrollZoom.disable()
map.addControl(new mapboxgl.NavigationControl());

