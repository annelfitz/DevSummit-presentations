/**
 * This step demonstrates how to better visualize our CSVLayer by applying
 * a renderer to it. In this case, a UniqueValueRenderer will be used to
 * differentiate the hurricanes based off the 'Category' field used for the
 * hurricane classification (using NOAA categories).
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

  // Initializing a UniqueValueRenderer()
  const uvrRenderer = {
    type: "unique-value",
    field: "Category",  // field the renderer uses to match unique values 
    defaultSymbol: {
      type: "simple-marker",
      color: "blue",
      size: "8px"
    },
    uniqueValueInfos: [
      {
        value: 1,
        symbol: {
          type: "picture-marker", // using PictureMarkerSymbol()
          url: "https://arcgis.github.io/arcgis-samples-javascript/sample-data/cat1.png"
        }
      },
      {
        value: 2,
        symbol: {
          type: "picture-marker",
          url: "https://arcgis.github.io/arcgis-samples-javascript/sample-data/cat2.png"
        }
      },
      {
        value: 3,
        symbol: {
          type: "picture-marker",
          url: "https://arcgis.github.io/arcgis-samples-javascript/sample-data/cat3.png"
        }
      },
      {
        value: 4,
        symbol: {
          type: "picture-marker",
          url: "https://arcgis.github.io/arcgis-samples-javascript/sample-data/cat4.png"
        }
      },
      {
        value: 5,
        symbol: {
          type: "picture-marker",
          url: "https://arcgis.github.io/arcgis-samples-javascript/sample-data/cat5.png"
        }
      }
    ]
  }

  const csvLayer = new CSVLayer({
    url: "https://arcgis.github.io/arcgis-samples-javascript/sample-data/hurricanes.csv",
    title: "Hurricanes",
    copyright: "NOAA",
    popupTemplate: template,
    renderer: uvrRenderer  // set the layer renderer to the UniqueValueRenderer()
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