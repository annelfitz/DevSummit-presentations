/**
 * This step takes care of just loading a GeoJSONLayer via a url onto 
 * a Map, and centering at a given coordinate location and zoom level.
 * This app also adds a PopupTemplate to the layer to view some attribute
 * information from each point in a popup.
 **/
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/GeoJSONLayer"
], function (Map, MapView, GeoJSONLayer) {

  // template for the PopupTemplate of the GeoJSONLayer
  const template = {
    title: "Earthquake information",
    content: "Magnitude {mag} {type} hit {place} on {time}",
    fieldInfos: [
      {
        fieldName: "time",
        format: {
          dateFormat: "short-date-short-time",
        },
      },
    ],
  };

  const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

  // Initializing the GeoJSONLayer
  const geojsonLayer = new GeoJSONLayer({
    title: "USGS Earthquake Data",
    url: url,
    copyright: "USGS Earthquakes",
    popupTemplate: template   // adding the PopupTemplate to the layer
  });

  // Adding the layer to the Map
  const map = new Map({
    basemap: "gray-vector",
    layers: [geojsonLayer],
  });

  const view = new MapView({
    container: "viewDiv",
    center: [-168, 46],
    zoom: 2,
    map: map,
  });

});