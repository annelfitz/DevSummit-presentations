const [FeatureLayer, Query, promiseUtils] = await $arcgis.import([
  "@arcgis/core/layers/FeatureLayer",
  "@arcgis/core/rest/support/Query",
  "@arcgis/core/core/promiseUtils",
]);
const viewElement = document.querySelector("arcgis-map");
await viewElement.viewOnReady();

const layer = viewElement.map.layers.getItemAt(0);
layer.outFields = [
  "NUMBER_OF_PERSONS_INJURED",
  "NUMBER_OF_PERSONS_KILLED",
  "OBJECTID",
];

viewElement.addEventListener("arcgisViewPointerMove", (event) => {
  const evt = event.detail;
  debouncedMoveHandler(evt).catch((error) => {
    if (!promiseUtils.isAbortError(error)) {
      throw error;
    }
  });
});

const debouncedMoveHandler = promiseUtils.debounce(async (event) => {
  const distance = document.getElementById("radius").value;

  const query = new Query({
    geometry: viewElement.toMap(event),
    spatialRelationship: "contains",
    distance,
    units: "kilometers",
    outStatistics: [
      {
        onStatisticField: "OBJECTID",
        outStatisticFieldName: "NUM_ACCIDENTS",
        statisticType: "count",
      },
      {
        onStatisticField: "NUMBER_OF_PERSONS_INJURED",
        outStatisticFieldName: "SUM_INJURED",
        statisticType: "sum",
      },
      {
        outStatisticFieldName: "SUM_KILLED",
        onStatisticField: "NUMBER_OF_PERSONS_KILLED",
        statisticType: "sum",
      },
    ],
    returnQueryGeometry: true,
  });

  const clientSide = document.getElementById("client-side").checked;
  const layerView = await viewElement.whenLayerView(layer);

  const featureSet = clientSide
    ? await layerView.queryFeatures(query)
    : await layer.queryFeatures(query);

  const { features, queryGeometry } = featureSet;
  const {
    attributes: { NUM_ACCIDENTS, SUM_INJURED, SUM_KILLED },
  } = features[0];

  const formatter = new Intl.NumberFormat();
  const accidents = formatter.format(NUM_ACCIDENTS);
  const injuries = formatter.format(SUM_INJURED);
  const deaths = formatter.format(SUM_KILLED);

  document.getElementById("num-accidents").innerHTML = accidents;
  document.getElementById("injuries").innerHTML = injuries;
  document.getElementById("deaths").innerHTML = deaths;

  viewElement.graphics.removeAll();
  viewElement.graphics.add({
    geometry: queryGeometry,
    symbol: {
      type: "simple-fill",
      outline: {
        color: "white",
        width: 1,
      },
      color: [255, 255, 0, 0.2],
    },
  });
});
