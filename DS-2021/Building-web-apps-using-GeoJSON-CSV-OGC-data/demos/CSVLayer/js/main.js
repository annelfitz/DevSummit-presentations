require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/CSVLayer",
  "esri/widgets/Expand",
  "esri/widgets/Legend",
  "esri/widgets/TimeSlider"
], function (Map, MapView, CSVLayer, Expand, Legend, TimeSlider) {
  const dropContainer = document.getElementById('dropContainer');
  const fileInput = document.getElementById('fileInput');

  const containerActiveHoverColor = "#ffffff";
  const defaultContainerColor = dropContainer.style.background;
  
  let csvLayer;
  let legend;
  let timeSlider;
  let legendExpand;

  const map = new Map({
    basemap: "dark-gray"
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-90, 34],
    zoom: 4
  });

  const expand = new Expand({
    expandIconClass: "esri-icon-upload",
    view: view,
    content: document.getElementById("infoDiv"),
    expanded: true
  });

  view.ui.add(expand, 'top-left');

  // this activates whenever a file is hovered over the
  // entire document
  // this is needed to keep the file from being opened in
  // the browser
  document.addEventListener('dragover', (e) => {
    if(e.target.className === "dropZone") {
      e.preventDefault();
    } 
  });

  document.addEventListener('dragenter', (e) => {
      if(e.target.className === "dropZone") {
        // change the background color of the div
        // to show the file is hovered over the dropContainer
        // element
        e.target.style.background = containerActiveHoverColor;
        // remove existing error message
        document.getElementById("fileTypeError").innerHTML = "";
        e.preventDefault();
      }
  });

  document.addEventListener('dragleave', (e) => {
      if(e.target.className === "dropZone") {
        // change the background color of the div
        // to its default
        e.target.style.background = defaultContainerColor;
        e.preventDefault();
      } 
  });

  dropContainer.addEventListener('drop', (e) => {
    // prevent the default behavior of opening
    // the file in the browser
    e.preventDefault();
    
    try {
      // obtain the file from the drop event
      const dataTrans = new DataTransfer();
      dataTrans.items.add(e.dataTransfer.files[0]);

      // set the file on the input to display the file
      // name
      fileInput.files = dataTrans.files;

      if(fileInput.files[0].name.includes(".csv") || fileInput.files[0].name.includes(".xlsx") || 
        fileInput.files[0].name.includes(".xls")) {
        createUrlFromFile(fileInput.files[0]);
        dropContainer.style.background = defaultContainerColor;
      } else {
        // invalid file type
        document.getElementById("fileTypeError").innerHTML = `Invalid file type! Please use .csv, .xls, or .xlsx extensions`;
        //remove the file
        fileInput.value = "";
        dropContainer.style.background = defaultContainerColor;
      }
    } catch (error) {
      console.log('no files were selected...');
      console.log('error: ', error);
    }
  });

  // function creates a DOMString containing a url representing
  // the specified File object uploaded
  function createUrlFromFile(uploadedFile) {
    // create the url
    const fileUrl = URL.createObjectURL(uploadedFile);

    csvLayer = new CSVLayer({
      url: fileUrl,
      title: "Hurricanes",
      copyright: "NOAA",
      renderer: {
          type: "unique-value",
          field: "Category",
          uniqueValueInfos: createUniqueValueInfos()
      },
      // csvlayer's timeInfo based on the date field
      timeInfo: {
        startField: "ISO_time", // name of the date field
        interval: {
          // set time interval to one year
          unit: "years",
          value: 1
        }
      },
      //popup template
      popupTemplate: {
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
      }
    });
    map.add(csvLayer);

    csvLayer.on('layerview-create', (event) => {
        const timeInfo = event.layerView.layer.timeInfo;
        // release the existing object url to free up
        // some memory, as now the CSVLayer can now use
        // client side graphics
        URL.revokeObjectURL(fileUrl);

        // add the legend
        legend = new Legend({
          view: view
        });

        legendExpand = new Expand({
          expandIconClass: "esri-icon-legend",
          view: view,
          content: legend,
          expanded: false
        });

        view.ui.add(legendExpand, 'top-left');

        // add the time slider
        timeSlider = new TimeSlider({
          container: document.createElement('div'),
          stops: {
            interval: {
              value: 1,
              unit: "years"
            }
          }
        });
        view.ui.add(timeSlider, "bottom-right");

        // set time slider's full extent to
        timeSlider.fullTimeExtent = {
          start: timeInfo.fullTimeExtent.start,
          end: timeInfo.fullTimeExtent.end
        };

        timeSlider.watch("timeExtent", () => {
          const layerView = event.layerView;
          layerView.definitionExpression = "ISO_time <= " + timeSlider.timeExtent.end.getTime();

          // gray out the hurricanes that are not in the current
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
  }

  function createUniqueValueInfos() {
    const fireflyImages = [
      "cat1.png",
      "cat2.png",
      "cat3.png",
      "cat4.png",
      "cat5.png"
    ];

    const baseUrl =
      "https://arcgis.github.io/arcgis-samples-javascript/sample-data/";

    return fireflyImages.map(function (url, i) {
      return {
        value: i + 1, // Category number
        symbol: {
          type: "picture-marker",
          url: baseUrl + url
        }
      };
    });
  }

});