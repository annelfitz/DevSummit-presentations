/**
 * This step demonstrates how to load a CSVLayer via a url.
 * This application also adds a PopupTemplate to the layer.
 **/
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/CSVLayer"
], function (Map, MapView, CSVLayer) {

  // PopupTemplate()
  const template = {
    title: "{Name}",
    content: [
      {
        type: "text",
        text:
          "A category {Category} storm with wind speeds of {wmo_wind} mph occurred at {ISO_time}."
      }
    ],
    fieldInfos: [
      {
        fieldName: "ISO_time",
        format: {
          dateFormat: "short-date-short-time"
        }
      }
    ]
  };

  const csvLayer = new CSVLayer({
    url: "https://arcgis.github.io/arcgis-samples-javascript/sample-data/hurricanes.csv",
    title: "Hurricanes",
    copyright: "NOAA",
    popupTemplate: template
  });

  const map = new Map({
    basemap: "dark-gray",
    layers: [csvLayer]
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-90, 34],
    zoom: 4
  });

});