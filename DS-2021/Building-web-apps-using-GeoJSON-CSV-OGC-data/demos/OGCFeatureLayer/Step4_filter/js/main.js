require([
    "esri/views/MapView",
    "esri/Map",
    "esri/layers/OGCFeatureLayer",
    "esri/widgets/Expand"
  ], function (
    MapView,
    Map,
    OGCFeatureLayer,
    Expand
  ) {
    let windmillLayerView;
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
    const titleExpand = new Expand({
        view: view,
        content: document.getElementById("appTitle"),
        expandIconClass: "esri-icon-question",
        expanded: true,
        group: "top-left"
      });
    view.ui.add(titleExpand, "top-left");

    const windmillElement = document.getElementById("windmill-filter");

    // click event handler for windmill types
    windmillElement.addEventListener("click", filterByType);

    function filterByType(event) {
        const selectedType = event.target.getAttribute("data-windmill");
        let filterDef = "";
        if (selectedType != "other"){
            filterDef = "FUNCTIE = '" + selectedType + "'"
        } else {
            filterDef = "NOT FUNCTIE = 'korenmolen' AND NOT FUNCTIE = 'poldermolen'"
        }
        windmillLayerView.effect = {
            filter: {
                where: filterDef
              },
              excludedEffect: "opacity(20%)"
        };
      }

    view.whenLayerView(windmillsLayer).then(function(layerView){
        windmillLayerView = layerView;

        // set up UI items
        windmillElement.style.visibility = "visible";
        const windmillExpand = new Expand({
          view: view,
          content: windmillElement,
          expandIconClass: "esri-icon-filter",
          group: "top-left"
        });
        //clear the filters when user closes the expand widget
        windmillExpand.watch("expanded", function () {
          if (!windmillExpand.expanded) {
            windmillLayerView.effect = null;
          }
        });
        view.ui.add(windmillExpand, "top-left");
    })
  });