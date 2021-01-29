/**
 * This step takes care of adding a renderer to the GeoJSON Layer, to better
 * visualize the earthquake data. This sample uses a ClassBreaksRenderer to visualize
 * the severity of the magnitude field ("mag") from the layer. The darker the 
 * red the more severe the magnitude of the earthquake is represented. 
 * The following sources were referenced for the classBreakInfos magnitude ranges
 * http://www.geo.mtu.edu/UPSeis/magnitude.html
 * https://www.britannica.com/science/earthquake-geology/Earthquake-magnitude
 **/
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/GeoJSONLayer",
  "esri/widgets/Legend",
  "esri/widgets/Expand"
], function (Map, MapView, GeoJSONLayer, Legend, Expand) {

  // ClassBreaksRenderer for the GeoJSONLayer
  const classBreaksRenderer = {
    type: "class-breaks",   // autocasts as new ClassBreaksRenderer()
    field: "mag",     // using the "mag" field from the GeoJSON data
    classBreakInfos: [
        {
          minValue: 0,
          maxValue: 3,
          symbol: {
            type: "simple-marker",
            color: "#ffed85",
            outline: {
                color: "#ffffff",
                width: 1
            }
          },
          label: "< 3 (Micro)"
        },
        {
          minValue: 3,
          maxValue: 4,
          symbol: {
            type: "simple-marker",
            color: "#ffb454",
            outline: {
                color: "#ffffff",
                width: 1
            }
          },
          label: "3 - 3.9 (Minor)"
        },
        {
          minValue: 4,
          maxValue: 5,
          symbol: {
            type: "simple-marker",
            color: "#ff7b22",
            outline: {
                color: "#ffffff",
                width: 1
            }
          },
          label: "4 - 4.9 (Light)"
        },
        {
          minValue: 5,
          maxValue: 6,
          symbol: {
            type: "simple-marker",
            color: "#c0370f",
            outline: {
                color: "#ffffff",
                width: 1
            }
          },
          label: "5 - 5.9 (Moderate)"
        },
        {
          minValue: 6,
          maxValue: 7,
          symbol: {
            type: "simple-marker",
            color: "#910000",
            outline: {
                color: "#ffffff",
                width: 1
            }
          },
          label: "6 - 6.9 (Strong)"
        }
    ]
  };

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
    popupTemplate: template,
    renderer: classBreaksRenderer  // adding the renderer to the layer
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

  const legend = new Legend({
      view: view,
      container: "legendDiv"
  });

  const expand = new Expand({
      view: view,
      content: document.getElementById('infoDiv'),
      expanded: true
  });

  view.ui.add(expand, "top-left");
});