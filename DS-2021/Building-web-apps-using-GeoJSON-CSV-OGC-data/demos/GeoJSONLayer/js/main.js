require([
  "esri/Map",
  "esri/layers/GeoJSONLayer",
  "esri/views/MapView",
  "esri/widgets/Legend",
  "esri/widgets/Slider",
  "esri/widgets/Expand"
], function (Map, GeoJSONLayer, MapView, Legend, Slider, Expand) {

  const filterSelect = document.getElementById("filter");
  const infoDiv = document.getElementById("infoDiv");

  const url =
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

  const template = {
    title: "Earthquake Info",
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

  const classBreaksRenderer = {
    type: "class-breaks",
    field: "mag",
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

  const clusterConfig = {
    type: "cluster",
    clusterRadius: "100px",
    popupTemplate: {
      content: [
          {
            type: "text",
            text: `This cluster contains <b>{cluster_count}</b> earthquakes.`
          },
          {
            type: "text",
            text: `The average magnitude of the earthquakes in this cluster is <b>{cluster_avg_mag}</b>,
                  which classifies these earthquakes on average as <b>{expression/mag-class}</b>`
          }
      ],
      fieldInfos: [
        {
          fieldName: "cluster_count",
          format: {
            places: 0,
            digitSeparator: true
          }
        },
        {
          fieldName: "cluster_avg_mag",
          format: {
            places: 2,
            digitSeparator: true
          }
        },
        {
          fieldName: "expression/mag-class",
        }
      ],
      expressionInfos: [
        {
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
    labelingInfo: [
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

  const geojsonLayer = new GeoJSONLayer({
    title: "USGS Earthquakes",
    url: url,
    copyright: "USGS Earthquakes",
    popupTemplate: template,
    renderer: classBreaksRenderer,
    featureReduction: clusterConfig
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
      content: infoDiv,
      expanded: true
  });

  view.ui.add(expand, "top-left");

  view.whenLayerView(geojsonLayer)
    .then((layerView) => {
      const field = "mag";
      
      filterSelect.addEventListener('input', (inputEvt) => {
          layerView.filter = {
            where: inputEvt.target.value
          }
      });
    });
  
});