require([
    "esri/views/MapView",
    "esri/Map",
    "esri/layers/OGCFeatureLayer",
  ], function (
    MapView,
    Map,
    OGCFeatureLayer
  ) {
    // Create the OGCFeatureLayer
    const windmillsLayer = new OGCFeatureLayer({
      url: "https://demo.pygeoapi.io/stable", // url to the OGC service
      collectionId: "dutch_windmills", // unique id of the collection
      // define rendering
      renderer: {
            type: "simple",
            symbol: {
            type: "picture-marker",
            url: "../windmill.png",
            height: "32px",
            width: "32px"
            }
        },
        popupTemplate: {
            title: "{NAAM}",
            content: [
            {
                type: "media",
                mediaInfos: [{
                type: "image",
                value: {
                    sourceURL: "{THUMBNAIL}",
                    linkURL: "{FOTO_GROOT}"
                }
                }]
            },
            {
                type: "fields",
                fieldInfos: [
                { label: "Name", fieldName: "NAAM"},
                { label: "Location", fieldName: "PLAATS"},
                { label: "Type", fieldName: "FUNCTIE"},
                { label: "Condition", fieldName: "STAAT"},
                { label: "Link", fieldName: "INFOLINK"}
                ]
            }
            ]
        }
    });

    // create map with custom basemap
    const map = new Map({
      basemap: "gray-vector",
      layers: [windmillsLayer] // add OGCFeatureLayer
    });

    const view = new MapView({
        container: "viewDiv",
        map,
        extent: {
            xmin: 5.05,
            ymin: 51.81,
            xmax: 6.05,
            ymax: 52.81,
            spatialReference: {
                wkid: 4326
            }
        },
        popup: {
            dockEnabled: true,
            dockOptions: {
                position: "bottom-right",
                breakpoint: false,
                buttonEnabled: false
            }
        }
    });
  });