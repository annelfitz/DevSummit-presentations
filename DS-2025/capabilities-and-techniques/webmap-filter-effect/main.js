let layerView;

const arcgisMap = document.querySelector("arcgis-map");
arcgisMap.addEventListener("arcgisViewReadyChange", async () => {
  const map = arcgisMap.map;
  // find the global power plants layer
  const powerPlantLayer = map.layers.find(
    (layer) => layer.title === "Global power plants"
  );
  // get the layerview for the power plant layer
  layerView = await arcgisMap.whenLayerView(powerPlantLayer);
});

fuelTypeSelect.addEventListener("calciteChipGroupSelect", handleFilterChange);

function handleFilterChange() {
  // get the selected fuel type
  const selectedFuelType = fuelTypeSelect.selectedItems[0];
  if (selectedFuelType?.value) {
    // apply the feature effect to the selected fuel type
    layerView.featureEffect = {
      filter: {
        where: `primary_fuel = '${selectedFuelType.value}'`,
      },
      excludedEffect: "opacity(30%)",
      includedEffect: "drop-shadow(1px, 1px, 1px)",
    };
  } else {
    // otherwise remove the effect
    layerView.featureEffect = null;
  }
}
