// This sample demonstrates how to:
// - Display a Cloud Optimized GeoTIFF (COG) using an ImageryTileLayer
// - Change the band composition (RGB) on the fly
// - Sample pixel values on click to compute NDVI
// - Plot a spectral profile using Chart.js

// Load ArcGIS JS API modules on-demand (keeps initial payload small for samples).
const [ImageryTileLayer, Graphic] = await $arcgis.import([
  "@arcgis/core/layers/ImageryTileLayer.js",
  "@arcgis/core/Graphic.js",
]);

// Grab UI + map component references.
const viewElement = document.querySelector("arcgis-map");
const bandIdsSelect = document.getElementById("band-ids-select");
const hintNotice = document.getElementById("hint");
const statusNotice = document.getElementById("status");
const statusMessage = document.getElementById("status-message");
const ndviDiv = document.getElementById("ndvi-div");
const ndviValueElement = document.getElementById("ndvi-value-element");
const loader = document.getElementById("chart-loader");
const chartDiv = document.getElementById("chart-div");
const spectralCanvas = document.getElementById("spectral-chart");

// Wait until the map component's underlying view is created and ready.
await viewElement.viewOnReady();

// Landsat 8 imagery hosted as a Cloud Optimized GeoTIFF (COG).
// The default bandIds below correspond to the "Natural color" combination.
const url =
  "https://ss6imagery.arcgisonline.com/imagery_sample/landsat8/Bolivia_LC08_L1TP_001069_20190719_MS.tiff";
const layer = new ImageryTileLayer({ url, bandIds: [3, 2, 1] });

// Add the imagery to the map, then zoom to its full extent once it's loaded.
viewElement.map.add(layer);

// Initialize the spectral chart (we update its dataset on each click).
const spectralChart = createSpectralChart(spectralCanvas);

// A simple marker graphic to show the last sampled location.
const pointGraphic = new Graphic({
  symbol: {
    type: "simple-marker",
    color: "cyan",
    outline: { color: "black", width: 1 },
    size: 10,
  },
});
viewElement.graphics.add(pointGraphic);

// Toggle loading state without shifting layout (loader overlays the NDVI value slot).
const setLoading = (isLoading) => {
  loader.hidden = !isLoading;
  if (isLoading) ndviValueElement.textContent = "";
};

// Show a user-friendly warning message in the panel.
const showStatus = (message) => {
  statusMessage.textContent = message;
  statusNotice.open = true;
};

// Hide the warning area when the app is in a good state.
const clearStatus = () => {
  statusNotice.open = false;
  statusMessage.textContent = "";
};

// Common case: user clicks outside the raster footprint.
const handleOutOfBounds = () => {
  showStatus("Click inside the raster footprint to sample pixel values.");
  pointGraphic.geometry = null;
  ndviValueElement.textContent = "";
  ndviDiv.hidden = true;
  spectralChart.data.datasets[0].data = [];
  spectralChart.update("none");
  setLoading(false);
};

// Switch the bandIds used to render the imagery.
// Each option uses a comma-separated "R,G,B" band index list.
bandIdsSelect.addEventListener("calciteSelectChange", () => {
  const bands = bandIdsSelect.value.split(",").map((id) => Number(id));
  layer.bandIds = bands;
});

// Click-to-sample:
// - Calls ImageryTileLayer.identify() at the clicked location
// - Uses returned band values to compute NDVI
// - Updates the chart with the sampled spectral values
viewElement.addEventListener(
  "arcgisViewClick",
  async ({ detail: { mapPoint } }) => {
    // Reveal the analysis UI on first interaction.
    hintNotice.open = false;
    if (chartDiv.hidden) chartDiv.hidden = false;
    clearStatus();

    pointGraphic.geometry = mapPoint;
    setLoading(true);

    try {
      // Identify returns the pixel values for each band at the given location.
      const results = await layer.identify(mapPoint);
      if (!results?.value) {
        handleOutOfBounds();
        return;
      }

      // // Only show the NDVI row once we have a valid sample.
      if (ndviDiv.hidden) ndviDiv.hidden = false;

      // NDVI = (NIR - Red) / (NIR + Red)
      // For Landsat 8, band 4 is red and band 5 is near-infrared (NIR).
      const { 3: redBand, 4: nearInfraredBand } = results.value;
      const denominator = nearInfraredBand + redBand;
      const ndvi =
        denominator === 0 ? NaN : (nearInfraredBand - redBand) / denominator;
      ndviValueElement.textContent = Number.isFinite(ndvi)
        ? ndvi.toFixed(3)
        : "N/A";

      // The identify result is an array-like list of band values.
      // Chart.js expects a plain array of numbers for the dataset.
      spectralChart.data.datasets[0].data = Array.from(results.value);
      spectralChart.update();
      setLoading(false);
    } catch (error) {
      // Network/cors errors or service issues can show up here.
      showStatus("Unable to sample pixel values. Please try again.");
      ndviValueElement.textContent = "";
      ndviDiv.hidden = true;
      setLoading(false);
    }
  },
);

function createSpectralChart(canvas) {
  // Labels include the band name and its approximate wavelength.
  // The order here matches the band order returned by identify().
  const visibleBandLabels = [
    "Coastal (0.45 µm)",
    "Blue (0.51 µm)",
    "Green (0.59 µm)",
    "Red (0.67 µm)",
  ];
  const infraredBandLabels = [
    "NIR (0.88 µm)",
    "SWIR1 (1.65 µm)",
    "SWIR2 (2.229 µm)",
    "Cirrus (1.38 µm)",
  ];

  return new Chart(canvas, {
    type: "line",
    data: {
      labels: [...visibleBandLabels, ...infraredBandLabels],
      datasets: [
        {
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
    options: {
      animation: true,
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { title: { display: true, text: "DN" } },
        x: { title: { display: true, text: "Band (wavelength)" } },
      },
      plugins: {
        legend: { display: false },
        title: { display: true, text: "Spectral profile" },
      },
    },
  });
}
