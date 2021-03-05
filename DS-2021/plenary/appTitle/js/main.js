require([
    "esri/views/MapView",
    "esri/WebMap",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/layers/TileLayer",
    "esri/widgets/Slider",
    "esri/widgets/Legend",
    "esri/core/watchUtils",
    "esri/widgets/Sketch/SketchViewModel",
    "esri/geometry/Polyline",
    "esri/geometry/Point",
    "esri/Graphic",
    "esri/geometry/geometryEngine",
    "esri/layers/GroupLayer",
    "esri/widgets/Histogram",
], function (
    MapView,
    WebMap,
    FeatureLayer,
    GraphicsLayer,
    TileLayer,
    Slider,
    Legend,
    watchUtils,
    SketchViewModel,
    Polyline,
    Point,
    Graphic,
    geometryEngine,
    GroupLayer,
    Histogram
) {
    // App 'globals'
    let sketchViewModel, featureLayerView, pausableWatchHandle;
    let statDefinitions,
        labels = [];
    let aboveAndBelow, legend;
    let chart, chartDonut;
    let animation = null;
    let incomeAge = "A15";

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
        layout: "horizontal",
        visibleElements: {
            rangeLabels: true,
            labels: true
        }
    });

    ageSlider.on(["thumb-drag", "segment-drag"], function (event) {
        if (event.state == "stop") {
            updateVisualization();
        }
    });
    const incomeSlider = new Slider({
        container: "incomeSliderDiv",
        min: 15000,
        max: 210000,
        values: [75000, 90000],
        labelFormatFunction: function(value, type) {
            let formattedVal = "$" + numberWithCommas(value)
            return formattedVal;
        },
        steps: 5000,
        layout: "horizontal",
        visibleElements: {
            rangeLabels: true,
        }
    });
    incomeSlider.on(["thumb-drag", "segment-drag"], function (event) {
        // featureLayer.renderer.visualVariables = null;
        setGapValue(incomeSlider.values[0],incomeSlider.values[1])
    });

    // Create layers
    const graphicsLayer = new GraphicsLayer();
    const bufferLayer = new GraphicsLayer({
        legendEnabled: false,
        blendMode: "color-burn"
    });
    const featureLayer = new FeatureLayer({
        blendMode: "source-in",
        portalItem: {
            // id: "0fda5b2428694ce5b17d3953a89fb4da" // SoCal
            // id: "e2d3120d9ff0483da88d23d9a67d83a0" // Northeast US
            // id: "ac514af2829b4ac4aaf7894a8b47f5cf" // California by block group
            // id: "81c2ede27746418a86ed44cf7df82cf4" // LA
            id: "43e16ed1f5b3481abfa8df4ee92dd45b" // California by block group with additional fields
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
                valueExpression: createAgeRange(
                    ageSlider.values[0],
                    ageSlider.values[1]
                ),
                valueExpressionTitle: "Percent of population aged " +
                    ageSlider.values[0] +
                    " - " +
                    ageSlider.values[1],
                stops: [{
                        value: 0.25,
                        label: "0.25%",
                        color: "#474333"
                    },
                    {
                        value: 10,
                        label: "10%",
                        color: "#23ccff"
                    }
                ]
            }]
        }
    });

    const buildingFootprints = new TileLayer({
        portalItem: {
            id: "7009e50f4c7b4eb7a77fb92cfac3835a"
        },
        legendEnabled: false,
        renderer: {
            type: "simple",
            symbol: {
                type: "simple-fill"
            }
        },
        minScale: 0,
        maxScale: 0
    });

    const groupLayer = new GroupLayer({
        layers: [buildingFootprints, featureLayer],
    });

    // create map with basemap
    const map = new WebMap({
        portalItem: {
            id: "08696a2de81e44cb8110d1bbabb86441"
        }
    });

    const view = new MapView({
        container: "viewDiv",
        map,
        center: [-118.25, 34.0656],
        zoom: 13
    });

    map.addMany([groupLayer, graphicsLayer, bufferLayer]);
    generateStats();
    setUpAppUI();
    setUpSketch();

    // set up calcite components and event listeners
    const filterAccordion = document.getElementById("filterAccordion");
    const radioAgeIncome = document.getElementById("ageForIncome");
    const tabs = document.getElementById("navTabs");
    const rendererSwitch = document.getElementById("switch");
    const radio = document.getElementById("filterAge");
    const playButton = document.getElementById("playButton");
    
    radio.addEventListener("calciteRadioGroupChange", updateSlider);

    rendererSwitch.addEventListener("calciteSwitchChange", function (event) {
        aboveAndBelow = event.detail.switched;
        updateVisualization();
    });

    tabs.addEventListener("calciteTabChange", function (event) {
        console.log(event);
        if (event.detail.tab == 1) {
            map.removeMany([bufferLayer, graphicsLayer]);
            sketchViewModel.view = null;
            view.ui.remove(legend);
            generatePredominanceRenderer(incomeAge);
        } else {
            map.addMany([bufferLayer, graphicsLayer]);
            sketchViewModel.view = view;
            if (featureLayerView.effect) {
                filterAccordion.click();
            }
            // need to get sketch view model hooked up again here 
            updateVisualization();
            view.ui.add(legend, "bottom-left");
        }
    });

    radioAgeIncome.addEventListener("calciteRadioGroupChange", function (event) {
        incomeAge = event.detail;
        generatePredominanceRenderer(incomeAge)
    });

    filterAccordion.addEventListener("calciteAccordionChange", function(event){
        if(!event.detail.requestedAccordionItem.active){
            // featureLayer.renderer.visualVariables = null;
            setGapValue(incomeSlider.values[0],incomeSlider.values[1])
        } else {
            featureLayerView.effect = null;
            generatePredominanceRenderer(incomeAge);
        }
    })
    
    playButton.addEventListener("click", function () {
        if (playButton.classList.contains("toggled")) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });

    function updateSlider(event) {
        switch (event.detail) {
            case "infant":
                ageSlider.values = [0, 1];
                ageSlider.disabled = true;
                break;
            case "child":
                ageSlider.values = [1, 11];
                ageSlider.disabled = true;
                break;
            case "teen":
                ageSlider.values = [12, 17];
                ageSlider.disabled = true;
                break;
            case "college":
                ageSlider.values = [18, 22];
                ageSlider.disabled = true;
                break;
            case "millenials":
                ageSlider.values = [24, 39];
                ageSlider.disabled = true;
                break;
            case "genx":
                ageSlider.values = [40, 55];
                ageSlider.disabled = true;
                break;
            case "boomer":
                ageSlider.values = [56, 74];
                ageSlider.disabled = true;
                break;
            case "none":
                ageSlider.disabled = false;
                break;
            default:
        }
        updateVisualization();
    }

    function createAgeRange(low, high) {
        let str = "var TOT = Sum(";

        for (let age = low; age <= high; age++) {
            str +=
                "Number($feature.MAGE" +
                age +
                "_CY), Number($feature.FAGE" +
                age +
                "_CY)";
            if (age != high) {
                str += ",";
            }
        }
        str += ")\n Round(((TOT/$feature.TOTPOP_CY)*100),2)";
        return str;
    }

    function findSqlAvg(low, high) {
        str = "(";
        for (let age = low; age <= high; age++) {
            str += "MAGE" + age + "_CY + FAGE" + age + "_CY";
            if (age != high) {
                str += "+";
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
            },
            {
                onStatisticField: findSqlAvg(ageSlider.values[0], ageSlider.values[1]),
                outStatisticFieldName: "pct_age_population_stddev",
                statisticType: "stddev"
            }
        ];
        let query = featureLayerView.createQuery();
        query.outStatistics = avgStats;

        featureLayerView.queryFeatures(query).then(function (response) {
            let stats = {
                avg: response.features[0].attributes.pct_age_population_avg,
                stddev: response.features[0].attributes.pct_age_population_stddev
            };
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
                    valueExpression: createAgeRange(
                        ageSlider.values[0],
                        ageSlider.values[1]
                    ),
                    valueExpressionTitle: "Percent of population aged " +
                        ageSlider.values[0] +
                        " - " +
                        ageSlider.values[1],
                    stops: createStops(maxValue, stats)
                }]
            };
        });
    }

    function generatePredominanceRenderer(ageVal) {
        console.log(ageVal);
        featureLayer.renderer = {
            "type": "unique-value",
            // "visualVariables": [{
            //     "type": "opacity",
            //     "valueExpression": "\n  $feature[\"" + ageVal + "I0_CY\"];\n$feature[\"" + ageVal + "I15_CY\"];\n$feature[\"" + ageVal + "I200_CY\"];\n$feature[\"" + ageVal + "I25_CY\"];\n$feature[\"" + ageVal + "I35_CY\"];\n$feature[\"" + ageVal + "I50_CY\"];\n$feature[\"" + ageVal + "I75_CY\"];\n$feature[\"" + ageVal + "I100_CY\"];\n$feature[\"" + ageVal + "I150_CY\"];\n\n  \n  var fieldNames = [ \"" + ageVal + "I0_CY\", \"" + ageVal + "I15_CY\", \"" + ageVal + "I200_CY\", \"" + ageVal + "I25_CY\", \"" + ageVal + "I35_CY\", \"" + ageVal + "I50_CY\", \"" + ageVal + "I75_CY\", \"" + ageVal + "I100_CY\", \"" + ageVal + "I150_CY\" ];\n  var numFields = 9;\n  var maxValueField = null;\n  var maxValue = -Infinity;\n  var value, i, totalValue = null;\n\n  for(i = 0; i < numFields; i++) {\n    value = $feature[fieldNames[i]];\n\n    if(value > 0) {\n      if(value > maxValue) {\n        maxValue = value;\n        maxValueField = fieldNames[i];\n      }\n      else if (value == maxValue) {\n        maxValueField = null;\n      }\n    }\n    \n  if(value != null && value >= 0) {\n    if (totalValue == null) { totalValue = 0; }\n    totalValue = totalValue + value;\n  }\n  \n  }\n  \n\n  var strength = null;\n\n  if (maxValueField != null && totalValue > 0) {\n    strength = (maxValue / totalValue) * 100;\n  }\n\n  return strength;\n  ",
            //     "valueExpressionTitle": "Strength of Predominance",
            //     "stops": [{
            //             "opacity": 0.05,
            //             "value": 12
            //         },
            //         {
            //             "opacity": 1,
            //             "value": 50
            //         }
            //     ]
            // }],
            "valueExpression": "\n  $feature[\"" + ageVal + "I0_CY\"];\n$feature[\"" + ageVal + "I15_CY\"];\n$feature[\"" + ageVal + "I200_CY\"];\n$feature[\"" + ageVal + "I25_CY\"];\n$feature[\"" + ageVal + "I35_CY\"];\n$feature[\"" + ageVal + "I50_CY\"];\n$feature[\"" + ageVal + "I75_CY\"];\n$feature[\"" + ageVal + "I100_CY\"];\n$feature[\"" + ageVal + "I150_CY\"];\n\n  \n  var fieldNames = [ \"" + ageVal + "I0_CY\", \"" + ageVal + "I15_CY\", \"" + ageVal + "I200_CY\", \"" + ageVal + "I25_CY\", \"" + ageVal + "I35_CY\", \"" + ageVal + "I50_CY\", \"" + ageVal + "I75_CY\", \"" + ageVal + "I100_CY\", \"" + ageVal + "I150_CY\" ];\n  var numFields = 9;\n  var maxValueField = null;\n  var maxValue = -Infinity;\n  var value, i, totalValue = null;\n\n  for(i = 0; i < numFields; i++) {\n    value = $feature[fieldNames[i]];\n\n    if(value > 0) {\n      if(value > maxValue) {\n        maxValue = value;\n        maxValueField = fieldNames[i];\n      }\n      else if (value == maxValue) {\n        maxValueField = null;\n      }\n    }\n    \n  }\n  \n  return maxValueField;\n  ",
            "valueExpressionTitle": "Predominant category",
            "uniqueValueInfos": [{
                "label": "< $15,000",
                "symbol": {
                    "type": "simple-fill",
                    "color": [
                        179,
                        0,
                        0,
                        255
                    ],
                    "outline": null
                },
                "value": ageVal + "I0_CY"
            }, {
                "label": "$15,000 - $24,999",
                "symbol": {
                    "type": "simple-fill",
                    "color": [
                        124,
                        17,
                        88,
                        255
                    ],
                    "outline": null
                },
                "value": ageVal + "I15_CY"
            }, {
                "label": "$25,000 - $34,999",
                "symbol": {
                    "type": "simple-fill",
                    "color": [
                        68,
                        33,
                        175,
                        255
                    ],
                    "outline": null
                },
                "value": ageVal + "I25_CY"
            }, {
                "label": "$35,000 - $49,999",
                "symbol": {
                    "type": "simple-fill",
                    "color": [
                        26,
                        83,
                        255,
                        255
                    ],
                    "outline": null
                },
                "value": ageVal + "I35_CY"
            }, {
                "label": "$50,000 - $74,999",
                "symbol": {
                    "type": "simple-fill",
                    "color": [
                        13,
                        136,
                        230,
                        255
                    ],
                    "outline": null
                },
                "value": ageVal + "I50_CY"
            }, {
                "label": "$75,000 - $99,999",
                "symbol": {
                    "type": "simple-fill",
                    "color": [
                        0,
                        183,
                        199,
                        255
                    ],
                    "outline": null
                },
                "value": ageVal + "I75_CY"
            }, {
                "label": "$100,000 - $149,999",
                "symbol": {
                    "type": "simple-fill",
                    "color": [
                        90,
                        212,
                        90,
                        255
                    ],
                    "outline": null
                },
                "value": ageVal + "I100_CY"
            }, {
                "label": "$150,000 - $199,999",
                "symbol": {
                    "type": "simple-fill",
                    "color": [
                        139,
                        224,
                        78,
                        255
                    ],
                    "outline": null
                },
                "value": ageVal + "I150_CY"
            }, {
                "label": "$200,000+",
                "symbol": {
                    "type": "simple-fill",
                    "color": [
                        235,
                        220,
                        120,
                        255
                    ],
                    "outline": null
                },
                "value": ageVal + "I200_CY"
            }]
        }
        createPieChart(ageVal);
    }

    async function createPieChart(ageVal) {
        const query = featureLayerView.createQuery();
        query.outStatistics = [{
                statisticType: "sum",
                onStatisticField: ageVal + "I0_CY",
                outStatisticFieldName: "F0_15"
            },
            {
                statisticType: "sum",
                onStatisticField: ageVal + "I15_CY",
                outStatisticFieldName: "F15_25"
            },
            {
                statisticType: "sum",
                onStatisticField: ageVal + "I25_CY",
                outStatisticFieldName: "F25_35"
            },
            {
                statisticType: "sum",
                onStatisticField: ageVal + "I35_CY",
                outStatisticFieldName: "F35_45"
            },
            {
                statisticType: "sum",
                onStatisticField: ageVal + "I50_CY",
                outStatisticFieldName: "F50_75"
            },
            {
                statisticType: "sum",
                onStatisticField: ageVal + "I75_CY",
                outStatisticFieldName: "F75_100"
            },
            {
                statisticType: "sum",
                onStatisticField: ageVal + "I100_CY",
                outStatisticFieldName: "F100_150"
            },
            {
                statisticType: "sum",
                onStatisticField: ageVal + "I150_CY",
                outStatisticFieldName: "F150_200"
            },
            {
                statisticType: "sum",
                onStatisticField: ageVal + "I200_CY",
                outStatisticFieldName: "F200_300"
            }
        ];

        const {
            features
        } = await featureLayerView.queryFeatures(query);

        const stats = features[0].attributes;
        let incomeStats = [];

        let startAge = ageVal.substr(1);
        let endAge = parseInt(startAge) + 9;

        for (var key in stats) {
            incomeStats.push(stats[key]);
        }

        if (!chartDonut) {
            console.log("creating chart");
            // Get the canvas element and render the chart in it
            const canvasElement = document.getElementById("chartDonut");

            chartDonut = new Chart(canvasElement.getContext("2d"), {
                type: "doughnut",
                data: {
                    datasets: [{
                        data: incomeStats,
                        backgroundColor: [
                            "#B30000",
                            "#7C1158",
                            "#4421AF",
                            "#1A53FF",
                            "#0D88E6",
                            "#00B7C7",
                            "#5AD45A",
                            "#8BE04E",
                            "#EBDC78"
                        ],
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                    }],
                    labels: [
                        "< $15,000",
                        "$15,000 - $25,000",
                        "$25,000 - $35,000",
                        "$35,000 - $50,000",
                        "$50,000 - $75,000",
                        "$75,000 - $100,000",
                        "$100,000 - $150,000",
                        "$150,000 - $200,000",
                        "$200,000+"
                    ]
                },
                options: {
                    responsive: true,
                    legend: {
                        position: "left",
                        labels: {
                            fontColor: "white"
                        }
                    },
                    title: {
                        display: true,
                        text: "Income for Ages " + startAge + "-" + endAge,
                        fontColor: "white"
                    }
                }
            });
        } else {
            chartDonut.data.datasets[0].data = incomeStats;
            chartDonut.options.title.text = "Income for Ages " + startAge + "-" + endAge
            chartDonut.update();
        }

    }

    function createStops(max, stats) {
        let stops = [];
        if (aboveAndBelow) {
            stops = [{
                    value: stats.avg - stats.stddev,
                    label: Number.parseFloat(stats.avg - stats.stddev).toFixed(2) + "%",
                    color: "#00ff32"
                },
                {
                    value: stats.avg,
                    label: Number.parseFloat(stats.avg).toFixed(2) + "%",
                    color: "#403a42"
                },
                {
                    value: max,
                    label: Number.parseFloat(max).toFixed(2) + "%",
                    color: "#bf00ff"
                }
            ];
        } else {
            stops = [{
                    value: stats.avg - stats.stddev,
                    label: Number.parseFloat(stats.avg - stats.stddev).toFixed(2) + "%",
                    color: "#474333"
                },
                {
                    value: max,
                    label: Number.parseFloat(max).toFixed(2) + "%",
                    color: "#23ccff"
                }
            ];
        }

        return stops;
    }

    function generateStats() {
        console.log("generating stats");
        let arr = [];
        for (let i = 0; i <= 84; i++) {
            let maleStr = "MAGE" + i + "_CY";
            let femaleStr = "FAGE" + i + "_CY";
            arr.unshift(maleStr, femaleStr);
            if (i == 0) {
                labels.unshift("<1");
            } else {
                labels.unshift(i);
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
        console.log("setting up app ui");
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
            legend = new Legend({
                view: view
            });
            view.ui.add(legend, "bottom-left");
        });
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
        if (event.toolEventInfo && event.toolEventInfo.mover.attributes.edge) {
            const toolType = event.toolEventInfo.type;
            console.log(toolType);
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

    // A plugin to draw the background color
    Chart.plugins.register({
        beforeDraw: function (chartInstance) {
            var ctx = chartInstance.chart.ctx;
            ctx.fillStyle = '#2b2b2b';
            ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
        }
    })




    /*********************************************************************
     * Spatial query the census tracts feature layer view for statistics
     * using the updated buffer polygon.
     *********************************************************************/
    function queryLayerViewAgeStats(buffer) {
        console.log("query function");
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
                    if (key.includes("FAGE")) {
                        femaleAgeData.push(attributes[key]);
                    } else if (key.includes("MAGE")) {
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
            const buffer = geometryEngine.geodesicBuffer(centerPoint, length, unit);

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
            graphicsLayer.addMany([
                centerGraphic,
                edgeGraphic,
                polylineGraphic,
                labelGraphic
            ]);
            // once center and edge point graphics are added to the layer,
            // call sketch's update method pass in the graphics so that users
            // can just drag these graphics to adjust the buffer
            setTimeout(function () {
                sketchViewModel.update([edgeGraphic, centerGraphic], {
                    tool: "move"
                });
            }, 1000);

            bufferLayer.addMany([bufferGraphic]);
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

    function updateChart(newData) {
        const femaleAgeData = newData[0];
        const maleAgeData = newData[1];

        if (!chart) {
            console.log("creating chart");
            // Get the canvas element and render the chart in it
            const canvasElement = document.getElementById("chart");

            chart = new Chart(canvasElement.getContext("2d"), {
                type: "horizontalBar",
                data: {
                    // age groups
                    labels: labels,
                    datasets: [{
                            label: "Female",
                            backgroundColor: "#826288",
                            borderWidth: 0,
                            data: femaleAgeData
                        },
                        {
                            label: "Male",
                            backgroundColor: "#4c689b",
                            borderWidth: 0,
                            data: maleAgeData
                        }
                    ]
                },
                options: {
                    responsive: false,
                    legend: {
                        position: "right",
                        labels: {
                            fontColor: "white"
                        }
                    },
                    title: {
                        display: false,
                    },
                    scales: {
                        yAxes: [{
                            categorySpacing: 0,
                            barThickness: 3,
                            stacked: true,
                            scaleLabel: {
                                display: true,
                                labelString: "Age group"
                            },
                            gridLines: {
                                color: 'rgba(255, 255, 255, 0.2)'
                            },
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
                            },
                            gridLines: {
                                color: 'rgba(255, 255, 255, 0.2)'
                            },
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
            });
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

    /**
     * Starts the animation that cycle
     * through the gap between the two candidates.
     */
    function startAnimation() {
        stopAnimation();
        animation = animate(incomeSlider.values[0], incomeSlider.values[1]);
        playButton.classList.add("toggled");
    }

    /**
     * Stops the animations
     */
    function stopAnimation() {
        if (!animation) {
            return;
        }

        animation.remove();
        animation = null;
        playButton.classList.remove("toggled");
    }

    /**
     * Animates the visualized gap continously.
     */
    function animate(startValue, endValue) {
        console.log("in animate function")
        var animating = true;
        // var value = startValue;
        var direction = 400;

        var frame = function () {
            if (!animating) {
                return;
            }

            startValue += direction;
            endValue += direction;
            if (endValue > 210000) {
                endValue = 210000;
                direction = -direction;
            } else if (startValue < 15000) {
                startValue = 15000;
                direction = -direction;
            }

            setGapValue(startValue, endValue);
            requestAnimationFrame(frame);
        };

        requestAnimationFrame(frame);

        return {
            remove: function () {
                animating = false;
            }
        };
    }

    function setGapValue(min, max){
        sliderValue.innerHTML =
              "<span style='font-weight:bold; font-size:120%'>" +
              "$" + numberWithCommas(min) + " - $" + numberWithCommas(max)
              "</span>";
        incomeSlider.viewModel.setValue(0, min);
        incomeSlider.viewModel.setValue(1, max);
        createEffect(min, max)
    }

    function createEffect(min,max){
        featureLayerView.effect = {
            filter: {
                where: "MEDHINC_CY > " + min + " AND MEDHINC_CY < " + max
            },
            includedEffect: "bloom(200%, 1px, 0.2)",
            excludedEffect: "blur(1px) brightness(65%)"
        }
    }

});