require([
    "esri/views/MapView",
    "esri/WebMap",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/layers/TileLayer",
    "esri/layers/VectorTileLayer",
    "esri/widgets/Slider",
    "esri/widgets/Legend",
    "esri/core/watchUtils",
    "esri/widgets/Sketch/SketchViewModel",
    "esri/geometry/Polyline",
    "esri/Graphic",
    "esri/geometry/geometryEngine",
    "esri/layers/GroupLayer",
    "esri/widgets/Bookmarks",
    "esri/widgets/Expand"
], function (
    MapView,
    WebMap,
    FeatureLayer,
    GraphicsLayer,
    TileLayer,
    VectorTileLayer,
    Slider,
    Legend,
    watchUtils,
    SketchViewModel,
    Polyline,
    Graphic,
    geometryEngine,
    GroupLayer,
    Bookmarks,
    Expand
) {
    const isMobileBrowser = function() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
      };

      if(isMobileBrowser()){
        document.body.innerHTML = null;
        const mobileMessage = document.createElement("div");
        mobileMessage.classList.add("mobile-message");
        mobileMessage.innerHTML = `This app loads too much data for mobile devices. 🤷‍♀️ Please try again on a desktop browser.`;
        document.body.appendChild(mobileMessage);
      }

    // App 'globals'
    let sketchViewModel, featureLayerView, pausableWatchHandle, aboveAndBelow, legend, chart, chartDonut;
    let statDefinitions, labels = [];
    let animation = null;
    let incomeAge = "HINC";
    let activeTab = "age";
    let effect = false;

    // graphics
    let centerGraphic,
        edgeGraphic,
        polylineGraphic,
        bufferGraphic,
        centerGeometryAtStart,
        labelGraphic;

    let unit = "miles";

    // slider for age range
    const ageSlider = new Slider({
        container: "sliderDiv",
        min: 0,
        max: 84,
        values: [18, 22], // start at college age range
        precision: 0,
        layout: "horizontal",
        disabled: true,
        visibleElements: {
            rangeLabels: true,
            labels: true
        }
    });
    // when slider is finished updating, update the visualization
    ageSlider.on(["thumb-drag", "segment-drag"], function (event) {
        if (event.state == "stop") {
            updateVisualization();
        }
    });

    // slider for income range, for layer effects
    const incomeSlider = new Slider({
        container: "incomeSliderDiv",
        min: 15000,
        max: 210000,
        values: [75000, 90000],
        labelFormatFunction: function (value, type) {
            let formattedVal = "$" + numberWithCommas(value)
            return formattedVal;
        },
        steps: 5000,
        layout: "horizontal",
        visibleElements: {
            rangeLabels: true,
        },
        disabled: true // initially disabled until filter is enabled
    });

    sliderValue.innerHTML = "<span style='font-weight:bold; font-size:120%'>" +
        "$" + numberWithCommas(incomeSlider.values[0]) + " - $" + numberWithCommas(incomeSlider.values[1]) + "</span>";

    // when the slider is moved, update the gap value for the filter/effect
    incomeSlider.on(["thumb-drag", "segment-drag"], function (event) {
        setGapValue(incomeSlider.values[0], incomeSlider.values[1])
    });

    // layers for the buffer graphic
    const graphicsLayer = new GraphicsLayer();
    const bufferLayer = new GraphicsLayer({
        legendEnabled: false,
        blendMode: "color-dodge"
    });
    // CA block group layer
    const featureLayer = new FeatureLayer({
        blendMode: "source-in", // will be blended with the buildingFootprints layer
        portalItem: {
            id: "86e2f7a5de0f4a86b2ff09c8abc4ab87" // CA block group with income
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

    // LA building footprints
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
        minScale: 245270,
        maxScale: 0
    });

    // group layer for blending block groups with building footprints
    const groupLayer = new GroupLayer({
        layers: [buildingFootprints, featureLayer],
    });

    // create map with basemap
    const map = new WebMap({
        portalItem: {
            id: "08696a2de81e44cb8110d1bbabb86441"
        }
    });
    // create view centered on LA
    const view = new MapView({
        container: "viewDiv",
        map,
        center: [-118.25, 34.0656],
        zoom: 13
    });
    // update layer blending at different scales
    view.watch("scale", function (newValue) {
        if (newValue > 245270) {
            featureLayer.blendMode = "normal";
        } else {
            if (featureLayer.blendMode == "normal") {
                featureLayer.blendMode = "source-in";
            }
        }
    })

    map.addMany([groupLayer, bufferLayer, graphicsLayer]); // add layers to the map
    generateStats(); // prepare statistics for querying/chart
    setUpAppUI();
    setUpSketch();

    /*********************************************************
     * set up calcite components and event listeners
     *********************************************************/
    const filterSwitch = document.getElementById("filterSwitch");
    const radioAgeIncome = document.getElementById("ageForIncome");
    const tabs = document.getElementById("navTabs");
    const rendererSwitch = document.getElementById("switch");
    const radio = document.getElementById("filterAge");
    const playButton = document.getElementById("playButton");
    const incomeSliderDiv = document.getElementById("incomeSliderDivWrapper");

    radio.addEventListener("calciteRadioGroupChange", updateSlider);

    rendererSwitch.addEventListener("calciteSwitchChange", function (event) {
        aboveAndBelow = event.detail.switched;
        updateVisualization();
    });

    tabs.addEventListener("calciteTabChange", function (event) {
        if (event.detail.tab == 1) {
            activeTab = "income";
            map.removeMany([bufferLayer, graphicsLayer]); // remove sketch/buffer graphics when switching to income tab
            sketchViewModel.view = null;
            view.ui.remove(legend);
            generatePredominanceRenderer(incomeAge); // update renderer
        } else {
            activeTab = "age";
            map.addMany([bufferLayer, graphicsLayer]);
            pausableWatchHandle.resume();
            setUpSketch();
            if (effect) {
                switchFunction(false)
                filterSwitch.switched = false;
            }
            updateVisualization();
            view.ui.add(legend, "bottom-left");
        }
    });

    radioAgeIncome.addEventListener("calciteRadioGroupChange", function (event) {
        incomeAge = event.detail;
        generatePredominanceRenderer(incomeAge)
    });

    filterSwitch.addEventListener("calciteSwitchChange", function (event) {
        switchFunction(event.detail.switched)
    })
    // start/stop animation for median income when play button is clicked
    playButton.addEventListener("click", function () {
        if (playButton.classList.contains("toggled")) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });

    function switchFunction(switched) {
        if (switched) {
            effect = true;
            incomeSlider.disabled = false; // enable slider
            incomeSliderDiv.classList.remove("disabled");
            setGapValue(incomeSlider.values[0], incomeSlider.values[1]) // apply effect
        } else {
            effect = false;
            incomeSlider.disabled = true; // disable slider
            incomeSliderDiv.classList.add("disabled");
            featureLayerView.effect = {
                filter: {
                    where: "MEDHINC_CY > " + incomeSlider.values[0] + " AND MEDHINC_CY < " + incomeSlider.values[1]
                },
                includedEffect: "bloom(0, 1px, 0.2)",
                excludedEffect: "blur(0px) brightness(100%)"
            };
            generatePredominanceRenderer(incomeAge);
        }
    }

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
    // arcade expression for calculating percentage of age range
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
    // get avg of age range for statistics
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
    /*******************************************************
     * Update renderer for age tab based on given age range
     *******************************************************/
    function updateVisualization() {
        // calculate stats for the given age range
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
        // execute query for the statistics
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
    // create the stops for the visual variables based on given stats
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
    /******************************************************************** 
     * generate predominance renderer for income tab based on age value
     ********************************************************************/
    function generatePredominanceRenderer(ageVal) {
        featureLayer.renderer = {
            type: "unique-value",
            valueExpression: "\n  $feature[\"" + ageVal + "I0_CY\"];\n$feature[\"" + ageVal + "I15_CY\"];\n$feature[\"" + ageVal + "I200_CY\"];\n$feature[\"" + ageVal + "I25_CY\"];\n$feature[\"" + ageVal + "I35_CY\"];\n$feature[\"" + ageVal + "I50_CY\"];\n$feature[\"" + ageVal + "I75_CY\"];\n$feature[\"" + ageVal + "I100_CY\"];\n$feature[\"" + ageVal + "I150_CY\"];\n\n  \n  var fieldNames = [ \"" + ageVal + "I0_CY\", \"" + ageVal + "I15_CY\", \"" + ageVal + "I200_CY\", \"" + ageVal + "I25_CY\", \"" + ageVal + "I35_CY\", \"" + ageVal + "I50_CY\", \"" + ageVal + "I75_CY\", \"" + ageVal + "I100_CY\", \"" + ageVal + "I150_CY\" ];\n  var numFields = 9;\n  var maxValueField = null;\n  var maxValue = -Infinity;\n  var value, i, totalValue = null;\n\n  for(i = 0; i < numFields; i++) {\n    value = $feature[fieldNames[i]];\n\n    if(value > 0) {\n      if(value > maxValue) {\n        maxValue = value;\n        maxValueField = fieldNames[i];\n      }\n      else if (value == maxValue) {\n        maxValue = value;\n        maxValueField = fieldNames[i];\n     }\n    }\n    \n  }\n  \n  return maxValueField;\n  ",
            valueExpressionTitle: "Predominant category",
            uniqueValueInfos: [{
                label: "< $15,000",
                symbol: {
                    type: "simple-fill",
                    color: [179, 0, 0, 255],
                    outline: null
                },
                value: ageVal + "I0_CY"
            }, {
                label: "$15,000 - $24,999",
                symbol: {
                    type: "simple-fill",
                    color: [124, 17, 88, 255],
                    outline: null
                },
                value: ageVal + "I15_CY"
            }, {
                label: "$25,000 - $34,999",
                symbol: {
                    type: "simple-fill",
                    color: [68, 33, 175, 255],
                    outline: null
                },
                value: ageVal + "I25_CY"
            }, {
                label: "$35,000 - $49,999",
                symbol: {
                    type: "simple-fill",
                    color: [26, 83, 255, 255],
                    outline: null
                },
                value: ageVal + "I35_CY"
            }, {
                label: "$50,000 - $74,999",
                symbol: {
                    type: "simple-fill",
                    color: [13, 136, 230, 255],
                    outline: null
                },
                value: ageVal + "I50_CY"
            }, {
                label: "$75,000 - $99,999",
                symbol: {
                    type: "simple-fill",
                    color: [0, 183, 199, 255],
                    outline: null
                },
                value: ageVal + "I75_CY"
            }, {
                label: "$100,000 - $149,999",
                symbol: {
                    type: "simple-fill",
                    color: [90, 212, 90, 255],
                    outline: null
                },
                value: ageVal + "I100_CY"
            }, {
                label: "$150,000 - $199,999",
                symbol: {
                    type: "simple-fill",
                    color: [139, 224, 78, 255],
                    outline: null
                },
                value: ageVal + "I150_CY"
            }, {
                label: "$200,000+",
                symbol: {
                    type: "simple-fill",
                    color: [235, 220, 120, 255],
                    outline: null
                },
                value: ageVal + "I200_CY"
            }]
        }
        createDonutChart(ageVal);
    }
    /****************************************************
     * Create donut chart for income based on age value
     ****************************************************/
    async function createDonutChart(ageVal) {
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
        let chartTitle = "";
        if (ageVal != "HINC") {
            let startAge = ageVal.substr(1);
            let endAge = parseInt(startAge) + 9;
            chartTitle = "Income Brackets for Ages " + startAge + "-" + endAge;
        } else {
            chartTitle = "Los Angeles County Income Brackets"
        }

        for (var key in stats) {
            incomeStats.push(stats[key]);
        }

        if (!chartDonut) {
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
                        text: chartTitle,
                        fontColor: "white"
                    }
                }
            });
        } else {
            chartDonut.data.datasets[0].data = incomeStats;
            chartDonut.options.title.text = chartTitle;
            chartDonut.update();
        }
    }

    function generateStats() {
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
        view.whenLayerView(featureLayer).then(function (layerView) {
            featureLayerView = layerView;

            pausableWatchHandle = watchUtils.pausable(
                featureLayerView,
                "updating",
                function (val) {
                    if (!val) {
                        drawBufferPolygon();
                    }
                }
            );
            const bookmarks = new Bookmarks({
                view: view
            });

            // Resume drawBufferPolygon() function; user searched for a new location
            // Must update the buffer polygon and re-run the stats query
            bookmarks.on("bookmark-select", function () {
                pausableWatchHandle.resume();
            });

            legend = new Legend({
                view: view,
                layerInfos: [{
                    title: "Los Angeles County Population Data",
                    layer: featureLayer
                }]
            });
            view.ui.add(legend, "bottom-left");
            view.ui.add(new Expand({
                view: view,
                content: bookmarks
            }), "top-right");

            // when the view is updated, update the donut chart when on the income tab
            featureLayerView.watch("updating", function (value) {
                if (!value) {
                    if (activeTab == "income") {
                        createDonutChart(incomeAge);
                    }
                }
            })
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

        // Query female and male age groups of the block groups that intersect
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
     * when user clicks a bookmark
     **************************************************/
    function drawBufferPolygon() {
        // When pause() is called on the watch handle, the callback represented by the
        // watch is no longer invoked, but is still available for later use
        // this watch handle will be resumed when user searches for a new location
        pausableWatchHandle.pause();

        // Initial location for the center, edge and polylines on the view
        const viewCenter = view.center.clone();
        const centerScreenPoint = view.toScreen(viewCenter);
        const centerPoint = view.toMap({
            x: centerScreenPoint.x,
            y: centerScreenPoint.y
        });
        const edgePoint = view.toMap({
            x: centerScreenPoint.x + 15,
            y: centerScreenPoint.y - 49
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
                color: "#009AF2"
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
    /*************************************
     * Create population pyramid chart
     ************************************/
    function updateChart(newData) {
        const femaleAgeData = newData[0];
        const maleAgeData = newData[1];

        if (!chart) {
            // Get the canvas element and render the chart in it
            const canvasElement = document.getElementById("chart");

            chart = new Chart(canvasElement.getContext("2d"), {
                type: "horizontalBar",
                data: {
                    // age groups
                    labels: labels,
                    datasets: [{
                            label: "Female",
                            backgroundColor: "#9f9f9f",
                            borderWidth: 0,
                            data: femaleAgeData,
                            barThickness: 2
                        },
                        {
                            label: "Male",
                            backgroundColor: "#ffffff",
                            borderWidth: 0,
                            data: maleAgeData,
                            barThickness: 2
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
        } else {
            chart.data.datasets[0].data = femaleAgeData;
            chart.data.datasets[1].data = maleAgeData;
            chart.update();
        }
    }

    // A plugin to draw the background color
    Chart.plugins.register({
        beforeDraw: function (chartInstance) {
            var ctx = chartInstance.chart.ctx;
            if (chartInstance.canvas.id == "chartDonut") {
                ctx.fillStyle = '#242424';
            } else {
                ctx.fillStyle = '#2b2b2b';
            }
            ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
        }
    })

    // Helper function for formatting number labels with commas
    function numberWithCommas(value) {
        value = value || 0;
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    /**********************************************
     * Functions for animating the filter effects
     *********************************************/
    // Starts the animation that cycle through the gap between the two income values.
    function startAnimation() {
        stopAnimation();
        animation = animate(incomeSlider.values[0], incomeSlider.values[1]);
        playButton.classList.add("toggled");
    }
    // Stops the animation
    function stopAnimation() {
        if (!animation) {
            return;
        }
        animation.remove();
        animation = null;
        playButton.classList.remove("toggled");
    }
    // Animates the visualized gap continuously.
    function animate(startValue, endValue) {
        var animating = true;
        // var value = startValue;
        var direction = 200;

        var frame = function () {
            if (!animating) {
                return;
            }
            startValue += direction;
            endValue += direction;
            if (endValue > 210000) { // when we reach the end, reverse direction
                endValue = 210000;
                direction = -direction;
            } else if (startValue < 15000) { // when we reach the beginning, reverse direction
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
    // updates the values displayed and values on the slider
    function setGapValue(min, max) {
        sliderValue.innerHTML =
            "<span style='font-weight:bold; font-size:120%'>" +
            "$" + numberWithCommas(min) + " - $" + numberWithCommas(max)
        "</span>";
        incomeSlider.viewModel.setValue(0, min);
        incomeSlider.viewModel.setValue(1, max);
        createEffect(min, max)
    }
    // creates the filter for the effect based on the values from the slider
    function createEffect(min, max) {
        featureLayerView.effect = {
            filter: {
                where: "MEDHINC_CY > " + min + " AND MEDHINC_CY < " + max
            },
            includedEffect: "bloom(150%, 1px, 0.2) saturate(200%)",
            excludedEffect: "blur(1px) brightness(65%)"
        }
    }
});