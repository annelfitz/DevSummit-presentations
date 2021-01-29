/**
 * This step takes care of adding the Legend and Expand widget into the application
 * in order to display a legend for our data. The Expand widget will allow us to
 * close and open the Legend.
 **/
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/GeoJSONLayer",
  "esri/widgets/Legend",
  "esri/widgets/Expand"
], function (Map, MapView, GeoJSONLayer, Legend, Expand) {

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

  const geojsonLayer = new GeoJSONLayer({
    title: "USGS Earthquake Data",
    url: url,
    copyright: "USGS Earthquakes",
    popupTemplate: template
  });

  const map = new Map({
    basemap: "dark-gray",
    layers: [geojsonLayer],
  });

  const view = new MapView({
    container: "viewDiv",
    center: [-168, 46],
    zoom: 2,
    map: map,
  });

  // Adding a couple widgets to the app

  // Adding a Legend widget
  const legend = new Legend({
      view: view,
      container: "legendDiv"
  });

  // Adding an Expand widget to hide
  // and display the Legend
  const expand = new Expand({
      view: view,
      content: document.getElementById('infoDiv'),
      expanded: true
  });

  // add the widget to the view
  view.ui.add(expand, "top-left");
});