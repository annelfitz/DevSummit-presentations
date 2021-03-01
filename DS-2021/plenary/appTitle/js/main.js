require([
    "esri/views/MapView",
    "esri/Map",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/widgets/Slider",
    "esri/widgets/Legend",
    "esri/core/watchUtils",
    "esri/widgets/Sketch/SketchViewModel",
    "esri/geometry/Polyline",
    "esri/geometry/Point",
    "esri/Graphic",
    "esri/geometry/geometryEngine",
], function (
    MapView,
    Map,
    FeatureLayer,
    GraphicsLayer,
    Slider,
    Legend,
    watchUtils,
    SketchViewModel,
    Polyline,
    Point,
    Graphic,
    geometryEngine,
) {
    // App 'globals'
    let sketchViewModel, featureLayerView, pausableWatchHandle, chartExpand;
    let statDefinitions, labels = [];
    let aboveAndBelow = false;

    // graphics
    let centerGraphic,
        edgeGraphic,
        polylineGraphic,
        bufferGraphic,
        centerGeometryAtStart,
        labelGraphic;

    let unit = "miles";

    const ageSlider = new Slider({
        container: "sliderDiv",
        min: 0,
        max: 84,
        values: [18, 22],
        precision: 0,
        layout: "vertical-reversed",
        visibleElements: {
            rangeLabels: true
        }
    });

    ageSlider.on(["thumb-drag", "segment-drag"], function (event) {
        if (event.state == "stop") {
            updateVisualization();
        }
    });

    // Create layers
    const graphicsLayer = new GraphicsLayer();
    const bufferLayer = new GraphicsLayer({
        blendMode: "color-burn"
    });
    const featureLayer = new FeatureLayer({
        portalItem: {
            // id: "0fda5b2428694ce5b17d3953a89fb4da" // SoCal
            id: "e2d3120d9ff0483da88d23d9a67d83a0"
        },
        outFields: ["*"],
        renderer: {
            type: "simple",
            symbol: {
                type: "simple-fill",
                color: "white",
                outline: null
            },
            visualVariables: [{
                type: "color",
                valueExpression: createAgeRange(ageSlider.values[0], ageSlider.values[1]),
                valueExpressionTitle: "Percent of population aged " + ageSlider.values[0] + " - " + ageSlider.values[1],
                stops: [{
                        value: 0,
                        label: "0%",
                        color: "#f7fbff"
                    },
                    {
                        value: 10,
                        label: "10%",
                        color: "#084594"
                    }
                ]
            }]
        }
    });

    // create map with basemap
    const map = new Map({
        basemap: "gray-vector",
    });

    const view = new MapView({
        container: "viewDiv",
        map,
        center: [-73.170, 41.313],
        zoom: 9
    });

    map.addMany([featureLayer, graphicsLayer, bufferLayer]);
    generateStats();
    setUpAppUI();
    setUpSketch();

    const radio = document.getElementById("filterAge");
    radio.addEventListener("calciteRadioGroupChange", updateSlider);

    const rendererSwitch = document.getElementById("switch");
    rendererSwitch.addEventListener("calciteSwitchChange", function (event) {
        aboveAndBelow = event.detail.switched;
        updateVisualization();
    });

    function updateSlider(event) {
        switch (event.detail) {
            case "young":
                ageSlider.values = [0, 3];
                ageSlider.disabled = true;
                break;
            case "hs":
                ageSlider.values = [14, 18];
                ageSlider.disabled = true;
                break;
            case "college":
                ageSlider.values = [18, 22];
                ageSlider.disabled = true;
                break;
            case "retired":
                ageSlider.values = [65, 84];
                ageSlider.disabled = true;
                break;
            case "none":
                ageSlider.disabled = false
                break;
            default:
        }
        updateVisualization();
    }

    function createAgeRange(low, high) {
        let str = "var TOT = Sum(";

        for (let age = low; age <= high; age++) {
            str += "Number($feature.MAGE" + age + "_CY), Number($feature.FAGE" + age + "_CY)";
            if (age != high) {
                str += ","
            }
        }
        str += ")\n Round(((TOT/$feature.TOTPOP_CY)*100),2)"
        return str;
    }

    function findSqlAvg(low, high) {
        str = "(";
        for (let age = low; age <= high; age++) {
            str += "MAGE" + age + "_CY + FAGE" + age + "_CY";
            if (age != high) {
                str += "+"
            }
        }
        str += ")/TOTPOP_CY * 100";
        return str;
    }

    function updateVisualization() {
        const avgStats = [{
            onStatisticField: findSqlAvg(ageSlider.values[0], ageSlider.values[1]),
            outStatisticFieldName: "pct_age_population_avg",
            statisticType: "avg"
        }, {
            onStatisticField: findSqlAvg(ageSlider.values[0], ageSlider.values[1]),
            outStatisticFieldName: "pct_age_population_stddev",
            statisticType: "stddev"
        }];
        let query = featureLayerView.createQuery();
        query.outStatistics = avgStats;

        featureLayerView.queryFeatures(query)
            .then(function (response) {
                let stats = {
                    avg: response.features[0].attributes.pct_age_population_avg,
                    stddev: response.features[0].attributes.pct_age_population_stddev
                }
                let maxValue = stats.avg + stats.stddev;
                featureLayer.renderer = {
                    type: "simple",
                    symbol: {
                        type: "simple-fill",
                        color: "white",
                        outline: null
                    },
                    visualVariables: [{
                        type: "color",
                        valueExpression: createAgeRange(ageSlider.values[0], ageSlider.values[1]),
                        valueExpressionTitle: "Percent of population aged " + ageSlider.values[0] + " - " + ageSlider.values[1],
                        stops: createStops(maxValue, stats)
                    }]
                }
            })
    }

    function createStops(max, stats) {
        let stops = [];
        if (aboveAndBelow) {
            stops = [{
                value: stats.avg - stats.stddev,
                label: Math.round(stats.avg - stats.stddev) + "%",
                color: "#b65151"
            }, {
                value: stats.avg,
                label: Math.round(stats.avg) + "%",
                color: "#ffffff"
            }, {
                value: max,
                label: Math.round(max) + "%",
                color: "#546b8c"
            }]
        } else {
            stops = [{
                    value: stats.avg - stats.stddev,
                    label: Math.round(stats.avg - stats.stddev) + "%",
                    color: "#f7fbff"
                },
                {
                    value: max,
                    label: Math.round(max) + "%",
                    color: "#084594"
                }
            ]
        }

        return stops;
    }

    function generateStats() {
        console.log("generating stats")
        let arr = [];
        for (let i = 0; i <= 84; i++) {
            let maleStr = "MAGE" + i + "_CY";
            let femaleStr = "FAGE" + i + "_CY";
            arr.unshift(maleStr, femaleStr);
            if (i == 0) {
                labels.unshift("<1");
            } else {
                labels.unshift(i)
            }
        }
        statDefinitions = arr.map(function (fieldName) {
            return {
                onStatisticField: fieldName,
                outStatisticFieldName: fieldName + "_TOTAL",
                statisticType: "sum"
            };
        });
    }

    function setUpAppUI() {
        console.log("setting up app ui")
        view.whenLayerView(featureLayer).then(function (layerView) {
            featureLayerView = layerView;

            pausableWatchHandle = watchUtils.pausable(
                layerView,
                "updating",
                function (val) {
                    if (!val) {
                        drawBufferPolygon();
                    }
                }
            );
            view.ui.add(new Legend({
                view: view
            }), "bottom-left");
        })
    }

    function setUpSketch() {
        sketchViewModel = new SketchViewModel({
            view: view,
            layer: graphicsLayer
        });

        // Listen to SketchViewModel's update event so that population pyramid chart
        // is updated as the graphics are updated
        sketchViewModel.on("update", onMove);
    }
    /*********************************************************************
     * Edge or center graphics are being moved. Recalculate the buffer with
     * updated geometry information and run the query stats again.
     *********************************************************************/
    function onMove(event) {
        // If the edge graphic is moving, keep the center graphic
        // at its initial location. Only move edge graphic
        if (
            event.toolEventInfo &&
            event.toolEventInfo.mover.attributes.edge
        ) {
            const toolType = event.toolEventInfo.type;
            console.log(toolType)
            if (toolType === "move-start") {
                centerGeometryAtStart = centerGraphic.geometry;
            }
            // keep the center graphic at its initial location when edge point is moving
            else if (toolType === "move" || toolType === "move-stop") {
                centerGraphic.geometry = centerGeometryAtStart;
            }
        }

        // the center or edge graphic is being moved, recalculate the buffer
        const vertices = [
            [centerGraphic.geometry.x, centerGraphic.geometry.y],
            [edgeGraphic.geometry.x, edgeGraphic.geometry.y]
        ];

        // client-side stats query of features that intersect the buffer
        calculateBuffer(vertices);

        // user is clicking on the view... call update method with the center and edge graphics
        if (event.state === "complete") {
            sketchViewModel.update([edgeGraphic, centerGraphic], {
                tool: "move"
            });
        }
    }

    function calculateBuffer(vertices) {
        // Update the geometry of the polyline based on location of edge and center points
        polylineGraphic.geometry = new Polyline({
            paths: vertices,
            spatialReference: view.spatialReference
        });

        // Recalculate the polyline length and buffer polygon
        const length = geometryEngine.geodesicLength(
            polylineGraphic.geometry,
            unit
        );
        const buffer = geometryEngine.geodesicBuffer(
            centerGraphic.geometry,
            length,
            unit
        );

        // Update the buffer polygon
        bufferGraphic.geometry = buffer;

        // Query female and male age groups of the census tracts that intersect
        // the buffer polygon on the client
        queryLayerViewAgeStats(buffer).then(function (newData) {
            // Create a population pyramid chart from the returned result
            updateChart(newData);
        });

        // Update label graphic to show the length of the polyline
        labelGraphic.geometry = edgeGraphic.geometry;
        labelGraphic.symbol = {
            type: "text",
            color: "#FFEB00",
            text: length.toFixed(2) + " " + unit,
            xoffset: 50,
            yoffset: 10,
            font: {
                // autocast as Font
                size: 14,
                family: "sans-serif"
            }
        };
    }

    /*********************************************************************
     * Spatial query the census tracts feature layer view for statistics
     * using the updated buffer polygon.
     *********************************************************************/
    function queryLayerViewAgeStats(buffer) {
        console.log("query function")
        // Data storage for the chart
        let femaleAgeData = [],
            maleAgeData = [];

        // Client-side spatial query:
        // Get a sum of age groups for census tracts that intersect the polygon buffer
        const query = featureLayerView.createQuery();
        query.outStatistics = statDefinitions;
        query.geometry = buffer;

        // Query the features on the client using FeatureLayerView.queryFeatures
        return featureLayerView
            .queryFeatures(query)
            .then(function (results) {
                // Statistics query returns a feature with 'stats' as attributes
                const attributes = results.features[0].attributes;
                // Loop through attributes and save the values for use in the population pyramid.
                for (var key in attributes) {
                    if (key.includes("F")) {
                        femaleAgeData.push(attributes[key]);
                    } else {
                        // Make 'all male age group population' total negative so that
                        // data will be displayed to the left of female age group
                        maleAgeData.push(-Math.abs(attributes[key]));
                    }
                }
                // Return information, seperated by gender
                return [femaleAgeData, maleAgeData];
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    /***************************************************
     * Draw the buffer polygon when application loads or
     * when user searches for a new location
     **************************************************/
    function drawBufferPolygon() {
        console.log("drawing buffer polygon");
        // When pause() is called on the watch handle, the callback represented by the
        // watch is no longer invoked, but is still available for later use
        // this watch handle will be resumed when user searches for a new location
        pausableWatchHandle.pause();

        // Initial location for the center, edge and polylines on the view
        const viewCenter = view.center.clone();
        const centerScreenPoint = view.toScreen(viewCenter);
        const centerPoint = view.toMap({
            x: centerScreenPoint.x + 120,
            y: centerScreenPoint.y - 120
        });
        const edgePoint = view.toMap({
            x: centerScreenPoint.x + 120,
            y: centerScreenPoint.y - 60
        });

        // Store updated vertices
        const vertices = [
            [centerPoint.x, centerPoint.y],
            [edgePoint.x, edgePoint.y]
        ];

        // Create center, edge, polyline and buffer graphics for the first time
        if (!centerGraphic) {
            const polyline = new Polyline({
                paths: vertices,
                spatialReference: view.spatialReference
            });

            // get the length of the initial polyline and create buffer
            const length = geometryEngine.geodesicLength(polyline, unit);
            const buffer = geometryEngine.geodesicBuffer(
                centerPoint,
                length,
                unit
            );

            // Create the graphics representing the line and buffer
            const pointSymbol = {
                type: "simple-marker",
                style: "circle",
                size: 10,
                color: [0, 255, 255, 0.5]
            };
            centerGraphic = new Graphic({
                geometry: centerPoint,
                symbol: pointSymbol,
                attributes: {
                    center: "center"
                }
            });

            edgeGraphic = new Graphic({
                geometry: edgePoint,
                symbol: pointSymbol,
                attributes: {
                    edge: "edge"
                }
            });

            polylineGraphic = new Graphic({
                geometry: polyline,
                symbol: {
                    type: "simple-line",
                    color: [254, 254, 254, 1],
                    width: 2.5
                }
            });

            bufferGraphic = new Graphic({
                geometry: buffer,
                symbol: {
                    type: "simple-fill",
                    color: [150, 150, 150],
                    outline: {
                        color: "#FFEB00",
                        width: 2
                    }
                }
            });
            labelGraphic = labelLength(edgePoint, length);

            // Add graphics to layer
            graphicsLayer.addMany([centerGraphic, edgeGraphic, polylineGraphic, labelGraphic]);
            // once center and edge point graphics are added to the layer,
            // call sketch's update method pass in the graphics so that users
            // can just drag these graphics to adjust the buffer
            setTimeout(function () {
                sketchViewModel.update([edgeGraphic, centerGraphic, polylineGraphic], {
                    tool: "move"
                });
            }, 1000);

            bufferLayer.addMany([
                bufferGraphic
            ]);
        }
        // Move the center and edge graphics to the new location returned from search
        else {
            centerGraphic.geometry = centerPoint;
            edgeGraphic.geometry = edgePoint;
        }

        // Query features that intersect the buffer
        calculateBuffer(vertices);
    }

    // Label polyline with its length
    function labelLength(geom, length) {
        return new Graphic({
            geometry: geom,
            symbol: {
                type: "text",
                color: "#FFEB00",
                text: length.toFixed(2) + " kilometers",
                xoffset: 50,
                yoffset: 10,
                font: {
                    // autocast as Font
                    size: 14,
                    family: "sans-serif"
                }
            }
        });
    }

    let chart;

    function updateChart(newData) {

        const femaleAgeData = newData[0];
        const maleAgeData = newData[1];

        if (!chart) {
            console.log("creating chart")
            // Get the canvas element and render the chart in it
            const canvasElement = document.getElementById("chart");

            chart = new Chart(canvasElement.getContext("2d"), {
                type: "horizontalBar",
                data: {
                    // age groups
                    labels: labels,
                    datasets: [{
                            label: "Female",
                            backgroundColor: "#B266FF",
                            borderWidth: 0,
                            data: femaleAgeData
                        },
                        {
                            label: "Male",
                            backgroundColor: "#0080FF",
                            borderWidth: 0,
                            data: maleAgeData
                        }
                    ]
                },
                options: {
                    responsive: false,
                    legend: {
                        position: "bottom"
                    },
                    title: {
                        display: true,
                        text: "Population pyramid"
                    },
                    scales: {
                        yAxes: [{
                            categorySpacing: 0,
                            barThickness: 3,
                            stacked: true,
                            scaleLabel: {
                                display: true,
                                labelString: "Age group"
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                callback: function (value) {
                                    const val = Math.abs(parseInt(value));
                                    return numberWithCommas(val);
                                }
                            },
                            scaleLabel: {
                                display: true,
                                labelString: "Population"
                            }
                        }]
                    },
                    tooltips: {
                        callbacks: {
                            label: function (tooltipItem, data) {
                                return (
                                    data.datasets[tooltipItem.datasetIndex].label +
                                    ": " +
                                    numberWithCommas(Math.abs(tooltipItem.xLabel))
                                );
                            }
                        }
                    }
                }
            });
            canvasElement.addEventListener("click", function (event) {
                let bars = chart.getElementsAtEvent(event);
                let index = bars[0]._index;
                let age = chart.data.labels[index];
                if (age == "<1") {
                    age = 0;
                }
                ageSlider.values = [age, age];
                updateVisualization();
            })
        } else {
            chart.data.datasets[0].data = femaleAgeData;
            chart.data.datasets[1].data = maleAgeData;
            chart.update();
        }
    }
    // Helper function for formatting number labels with commas
    function numberWithCommas(value) {
        value = value || 0;
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
});