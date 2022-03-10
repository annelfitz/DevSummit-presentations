import './style.css'

// import '@arcgis/core/assets/esri/themes/light/main.css';


import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';

const map = new WebMap({
  portalItem: {
    id: "ceb8954a5f2c457284c5074efd5a5ca0"
  }
});
const view = new MapView({
  map: map,
  container: "viewDiv"
})

