/**
 * This step takes care of adding clustering to the GeoJSONLayer using
 * its featureReduction property. This application also demonstrates
 * how Arcade can be used to obtain statistics (cluster_count and cluster_avg)
 * from the clusters and display the results in either the cluster labels, 
 * or the cluster popups.
 **/
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/GeoJSONLayer",
  "esri/widgets/Legend",
  "esri/widgets/Expand"
], function (Map, MapView, GeoJSONLayer, Legend, Expand) {

  // Clustering configuration
  const clusterConfig = {
    type: "cluster",
    clusterRadius: "100px",
    popupTemplate: {
      title: "Earthquake cluster data",
      content: [
          {
            type: "text",
            text: `This cluster contains <b>{cluster_count}</b> earthquakes.`
          },
          {
            type: "text",
            text: `The average magnitude of the earthquakes in this cluster is 
                  <b>{cluster_avg_mag}</b>, which classifies these earthquakes 
                  on average as <b>{expression/mag-class}</b>`
          }
      ],
      fieldInfos: [
        {
          fieldName: "cluster_count",  // The number of features in the cluster.
          format: {
            places: 0,
            digitSeparator: true
          }
        },
        {
          // For renderers visualizing a number field with class breaks, 
          // this field describes the average of the rendered field among all features 
          // in the cluster.
          fieldName: "cluster_avg_mag",
          format: {
            places: 2,
            digitSeparator: true
          }
        },
        {
          fieldName: "expression/mag-class", // custom arcade expression from the expressionInfos
        }
      ],
      expressionInfos: [
        {
          // Arcade expression to return the average magnitude value in the cluster
          // The magnitude classification was referenced from
          // the following sources:
          // http://www.geo.mtu.edu/UPSeis/magnitude.html
          // https://www.britannica.com/science/earthquake-geology/Earthquake-magnitude
          name: "mag-class",
          title: "average magnitude class",
          expression: `Decode(Floor($feature.cluster_avg_mag), 
            0, 'Micro. Usually not felt, but can be recorded by seismograph.', 
            1, 'Micro. Usually not felt, but can be recorded by seismograph.', 
            2, 'Micro. Usually not felt, but can be recorded by seismograph.', 
            3, 'Minor. Felt by many people; no damage.', 
            4, 'Light. Felt by all; minor breakage of objects.', 
            5, 'Moderate. Some damage to weak structures.', 
            6, 'Strong. Moderate damage in populated areas.','null')`
        }
      ]
    },
    clusterMinSize: "24px",
    clusterMaxSize: "60px",
    labelingInfo: [   // labeling for the clusters
      {
        deconflictionStrategy: "none",
        labelExpressionInfo: {
          expression: "Text($feature.cluster_count, '#,###')"
        },
        symbol: {
          type: "text",
          color: "#004a5d",
          font: {
            weight: "bold",
            family: "Noto Sans",
            size: "12px"
          }
        },
        labelPlacement: "center-center"
      }
    ]
  };

  const classBreaksRenderer = {
    type: "class-breaks",   // autocasts as new ClassBreaksRenderer()
    field: "mag",     // using the "mag" field from the GeoJSON data
    classBreakInfos: [
        {
          minValue: 0,
          maxValue: 3,
          symbol: {
            type: "simple-marker",
            color: "#ffa143",
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
            color: "#ff7b22",
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
            color: "#ef6a1d",
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
            color: "#e05919",
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
            color: "#c0370f",
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
    renderer: classBreaksRenderer,
    featureReduction: clusterConfig   // setting the clustering configuration
  });

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