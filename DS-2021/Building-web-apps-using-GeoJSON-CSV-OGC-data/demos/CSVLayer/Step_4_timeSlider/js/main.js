/**
 * This step demonstrates how to use the temporal data
 * of the CSVLayer in the TimeSlider widget. This application filters
 * the hurricanes based off the corresponding time frame in the
 * TimeSlider widget, as it progresses by year. The app takes 
 * advantage of the effect property to highlight the filtered results
 * and gray out the hurricanes that do not satisfy the filter without removing
 * them completely.
 **/
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/CSVLayer",
  "esri/widgets/Legend",
  "esri/widgets/Expand",
  "esri/widgets/TimeSlider"
], function (Map, MapView, CSVLayer, Legend, Expand, TimeSlider) {

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
    field: "Category",
    defaultSymbol: {
      type: "simple-marker",
      color: "blue",
      size: "8px"
    },
    uniqueValueInfos: [
      {
        value: 1,
        symbol: {
          type: "picture-marker",
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
    renderer: uvrRenderer,
    // CSVLayer's timeInfo based on the date field
    timeInfo: {
      startField: "ISO_time", // name of the date field
      interval: {
        // set time interval to one year
        unit: "years",
        value: 1
      }
    }
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

  // Adding a TimeSlider Widget
  const timeSlider = new TimeSlider({
    container: document.createElement('div'),
    stops: {
      interval: {
        value: 1,
        unit: "years"
      }
    }
  });

  // Add the TimeSlider to the view 
  view.ui.add(timeSlider, "bottom-right");

  // Filter the hurricanes based off the
  // widget's time ranges as it progresses
  view.whenLayerView(csvLayer).then((layerView) => {

    // Obtain the time info of the layer, which represents
    // the temporal data of a time-aware layer
    const timeInfo = layerView.layer.timeInfo;

    // Set TimeSlider's full extent
    timeSlider.fullTimeExtent = {
      start: timeInfo.fullTimeExtent.start,
      end: timeInfo.fullTimeExtent.end
    };

    timeSlider.watch("timeExtent", () => {
      // Gray out the hurricanes that are not in the current
      // time frame being observed by the TimeSlider widget
      layerView.effect = {
        filter: {
          timeExtent: timeSlider.timeExtent,
          geometry: view.extent
        },
        excludedEffect: "grayscale(20%) opacity(12%)"
      };
    });
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