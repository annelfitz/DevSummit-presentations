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
        id: "f40326b0dea54330ae39584012807126"
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
            minValue,
            maxValue
        ),
        valueExpressionTitle: "Percent of population aged " +
            minValue +
            " - " +
            maxValue,
        stops: createStops(maxValue, stats)
    }]
};

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


function queryLayerViewAgeStats(buffer) {
    const query = featureLayerView.createQuery();
    query.outStatistics = statDefinitions; // defined earlier from each of the age fields for men and women
    query.geometry = buffer;

    // Query the features on the client using FeatureLayerView.queryFeatures
    return featureLayerView
        .queryFeatures(query)
        .then(function (results) {
            // Parse results
            // Return information, seperated by gender
            return [femaleAgeData, maleAgeData];
        })
        .catch(function (error) {
            console.log(error);
        });
}

function createEffect(min, max) {
    featureLayerView.effect = {
        filter: {
            where: "MEDHINC_CY > " + min + " AND MEDHINC_CY < " + max
        },
        includedEffect: "bloom(150%, 1px, 0.2) saturate(200%)",
        excludedEffect: "blur(1px) brightness(65%)"
    }
}