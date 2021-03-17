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