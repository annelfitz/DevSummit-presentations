require([
    "esri/views/MapView",
    "esri/Map",
    "esri/layers/OGCFeatureLayer",
    "esri/widgets/Expand"
  ], function (
    MapView,
    Map,
    OGCFeatureLayer
  ) {
    // Create the OGCFeatureLayer
    const windmillsLayer = new OGCFeatureLayer({
      url: "https://demo.pygeoapi.io/stable", // url to the OGC service
      collectionId: "dutch_windmills", // unique id of the collection
    });

    // create map with basemap
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
        }
    });
  });