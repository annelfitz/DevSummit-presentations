/**
 * This step takes care of adding the Legend and Expand widget into the application
 * in order to display a legend for our data. The Expand widget will allow us to
 * close and open the Legend.
 **/
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/CSVLayer",
  "esri/widgets/Legend",
  "esri/widgets/Expand"
], function (Map, MapView, CSVLayer, Legend, Expand) {

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

  // Adding a Legend and Expand widget
  const legend = new Legend({
    view: view
  });

  const legendExpand = new Expand({
    expandIconClass: "esri-icon-legend",
    view: view,
    content: legend,
    expanded: true
  });

  view.ui.add(legendExpand, 'top-left');
});