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
    expanded: true,
    group: "top-left"
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
      const files = e.dataTransfer.files;
      const file = files[0];

      // set the file on the input to display the filename
      if(file.type === "application/vnd.ms-excel") {
        fileInput.files = files;
        createUrlFromFile(file);
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

  // We also want to be able to directly upload a file with the filepicker
  fileInput.addEventListener('input', (event) => {
    console.log('fileinputchange: ', event);
    const file = event.target.files[0];
    createUrlFromFile(file);
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
      spatialReference: view.spatialReference,
      renderer: {
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
      popupTemplate: template
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
          expanded: false,
          group: "top-left"
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
});