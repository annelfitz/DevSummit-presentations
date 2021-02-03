/**
 * This sample demonstrates an example of how to load a
 * GeoJSON object using a blob. To learn more about what a
 * blob is, and its benefits, visit https://developer.mozilla.org/en-US/docs/Web/API/Blob
 * for more information.
 * This alternative method does not require a url to load
 * the GeoJSON layer. It takes advantage of the FeatureCollection
 * GeoJSON object, to load multiple point features.
 **/
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/GeoJSONLayer"
], function (Map, MapView, GeoJSONLayer) {

  // Adding the layer to the Map
  const map = new Map({
    basemap: "dark-gray"
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-100, 40],
    zoom: 3
  });

  // GeoJSON FeatureCollection object with three Point features.
  const geojson = {
    type: "FeatureCollection",
    features: [{
      type: "Feature",
      geometry: { type: "Point", coordinates: [-100, 45] },
      properties: { name: "none" }
    }, {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-100, 40] },
      properties: { name: "none" }
    }, {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-100, 35] },
      properties: { name: "none" }
    }]
  };

  // Constructing the blob
  const blob = new Blob([JSON.stringify(geojson)], {
    type: "application/json"
  });
  
  // Creates a DOMString containing a URL that
  // represents the object
  let url = URL.createObjectURL(blob);

  // The url represents the Blob object, and now with a valid
  // url, we can pass it to the GeoJSONLayer url property.
  const layer = new GeoJSONLayer({ url });

  layer.load().then(() => {
    // Once the layer successfully loads, add it to the map.
    map.add(layer);

    // Unload the url for good memory usage
    URL.revokeObjectURL(url);
    url = null;
  });

});