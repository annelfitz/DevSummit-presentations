import Map from "https://jsdev.arcgis.com/4.23/@arcgis/core/Map.js";
import GraphicsLayer from "https://jsdev.arcgis.com/4.23/@arcgis/core/layers/GraphicsLayer.js";
import GeoJSONLayer from "https://jsdev.arcgis.com/4.23/@arcgis/core/layers/GeoJSONLayer.js";
import SceneLayer from "https://jsdev.arcgis.com/4.23/@arcgis/core/layers/SceneLayer.js";
import VectorTileLayer from "https://jsdev.arcgis.com/4.23/@arcgis/core/layers/VectorTileLayer.js";
import Extent from "https://jsdev.arcgis.com/4.23/@arcgis/core/geometry/Extent.js";
import LabelClass from "https://jsdev.arcgis.com/4.23/@arcgis/core/layers/support/LabelClass.js";
import Color from "https://jsdev.arcgis.com/4.23/@arcgis/core/Color.js";
import Polygon from "https://jsdev.arcgis.com/4.23/@arcgis/core/geometry/Polygon.js";
import Graphic from "https://jsdev.arcgis.com/4.23/@arcgis/core/Graphic.js";

const shopWallsUrl =
  "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/shop_walls_zurichhb/FeatureServer";

//////////////////////////
// Utils
//////////////////////////

const colors = {
  blue: new Color([0, 106, 255]),
  lightOrange: new Color([255, 228, 156]),
  lighterBlue: new Color([230, 240, 255]),
  lightBlue: new Color([184, 213, 255]),
  darkBlue: new Color([30, 72, 133]),
  darkOrange: new Color([240, 152, 0]),
  white: new Color([255, 255, 255]),
  lightGray: new Color([232, 232, 232]),
  darkGray: new Color([100, 100, 100]),
};

const extent = new Extent({
  xmin: 8.53418,
  xmax: 8.54302,
  ymin: 47.37569,
  ymax: 47.38077,
  spatialReference: 4326,
});

export const floorMapping = [
  {
    name: "Overview",
    originalNames: ["Erdgeschoss"],
    trueElevation: 410,
    elevation: 150,
    textColor: colors.darkGray,
    lightColor: new Color("#D1CBC8"),
    darkColor: new Color("#FF9C00"),
  },
  {
    name: "Ground",
    originalNames: ["Erdgeschoss"],
    trueElevation: 410,
    elevation: 150,
    textColor: colors.darkGray,
    lightColor: new Color("#D1CBC8"),
    darkColor: new Color("#FF9C00"),
  },
  {
    name: "-1",
    originalNames: ["Zwischengeschoss"],
    trueElevation: 385,
    elevation: 100,
    textColor: colors.darkGray,
    lightColor: new Color("#D1CDC0"),
    darkColor: new Color("#FFF100"),
  },
  {
    name: "-2",
    originalNames: ["Shopville", "Untergeschoss", "Shopville/Aufgänge"],
    trueElevation: 360,
    elevation: 50,
    textColor: colors.darkGray,
    lightColor: new Color("#A3B8A6"),
    darkColor: new Color("#3FD54E"),
  },
  {
    name: "-3",
    originalNames: ["Bahnhöfe Löwenstrasse / Museumsstrasse", "Bahnhof SZU"],
    trueElevation: 335,
    elevation: 1,
    textColor: colors.darkGray,
    lightColor: new Color("#CEDFFF"),
    darkColor: new Color("#6267FF"),
  },
];

export function floorNames(floor) {
  return floorMapping[floor].originalNames
    .map((name) => `'${name}'`)
    .join(", ");
}

const floorExpression = floorMapping.reduce(
  (prev, floorMap, index) =>
    prev +
    `
 if (Includes([${floorNames(index)}], $feature.floor)) {
   return ${floorMap.elevation};
 }
`,
  ""
);

export const elevationInfo = {
  mode: "relative-to-ground",
  featureExpressionInfo: {
    expression: floorExpression,
  },
};

export const serviceCleanUp =
  "Category NOT IN ('Öffentlicher Verkehr', 'Piktogramm (Übrige)', 'Kombinierte Mobilität')";

export const labelExpression = `
  var hourFrom = $feature.openhours_from;
  var hourTo = $feature.openhours_to;
  if (IsEmpty(hourFrom) || IsEmpty(hourTo)) {
    return $feature.name;
  }
  return $feature.name + TextFormatting.NewLine + hourFrom + " - " + hourTo;
`;

export const areasLayer = new GeoJSONLayer({
  url: "./data/areas.json",
  elevationInfo: elevationInfo,
  field: ["*"],
  renderer: {
    type: "unique-value",
    valueExpression: `
    if (Includes(['shops', 'restaurants'], $feature.type)) {
      return 'shops';
    }

    if (Includes(['perron', 'gleis'], $feature.type)) {
      return 'platform';
    }

    if (Includes(['treppe', 'rolltreppe'], $feature.type)) {
      return 'infrastructure';
    }

    return 'other';
    `,
    uniqueValueInfos: [
      {
        value: "shops",
        symbol: {
          type: "polygon-3d",
          symbolLayers: [
            {
              type: "fill",
              material: { color: colors.lighterBlue },
              size: 3,
            },
          ],
        },
        label: "Shopping area",
      },
      {
        value: "platform",
        symbol: {
          type: "polygon-3d",
          symbolLayers: [
            {
              type: "extrude",
              material: { color: colors.lightOrange },
              size: 1,
            },
          ],
        },
        label: "Platform",
      },
      {
        value: "infrastructure",
        symbol: {
          type: "polygon-3d",
          symbolLayers: [
            {
              type: "extrude",
              material: { color: colors.lightGray },
              size: 1.5,
            },
          ],
        },
        label: "Stairs",
      },
      {
        value: "other",
        symbol: {
          type: "polygon-3d",
          symbolLayers: [
            {
              type: "fill",
              material: { color: colors.white },
              outline: {
                size: 1.6,
                color: colors.lightGray,
              },
            },
          ],
        },
      },
    ],
  },
  // definitionExpression: "type NOT IN ('treppe', 'rolltreppe', 'rampe')",
});

// export const areasLayer = new GeoJSONLayer({
//   url: "./data/areas.json",
//   elevationInfo: elevationInfo,
//   field: ["*"],
//   renderer: {
//     type: "unique-value",
//     valueExpression: floorMapping.reduce(
//       (prev, floorMap, index) =>
//         prev +
//         `
//          if ($feature.type != 'shops' && Includes([${floorNames(
//            index
//          )}], $feature.floor)) {
//            return "${floorMap.name}";
//          }

//           if ($feature.type == 'shops' && Includes([${floorNames(
//             index
//           )}], $feature.floor)) {
//            return "${floorMap.name}-shops";
//          }
//         `,
//       ""
//     ),
//     defaultSymbol: {
//       type: "polygon-3d",
//       symbolLayers: [
//         {
//           type: "fill",
//           material: { color: colors.white },
//           outline: {
//             size: 1.6,
//             color: colors.lightGray,
//           },
//         },
//       ],
//     },
//     uniqueValueInfos: floorMapping
//       .map((floor) => ({
//         value: floor.name,
//         symbol: {
//           type: "polygon-3d",
//           symbolLayers: [
//             {
//               type: "fill",
//               material: { color: floor.lightColor },
//               size: 3,
//             },
//           ],
//         },
//         label: floor.name,
//       }))
//       .concat(
//         floorMapping.map((floor) => ({
//           value: `${floor.name}-shops`,
//           symbol: {
//             type: "polygon-3d",
//             symbolLayers: [
//               {
//                 type: "fill",
//                 material: { color: floor.darkColor },
//                 size: 3,
//               },
//             ],
//           },
//           label: `${floor.name}-shops`,
//         }))
//       ),
//   },
//   definitionExpression: "type NOT IN ('treppe', 'rolltreppe', 'rampe')",
// });

export const simplAreasRenderer = {
  type: "unique-value",
  field: "type",
  defaultSymbol: {
    type: "polygon-3d",
    symbolLayers: [
      {
        type: "fill",
        material: { color: colors.white },
        outline: {
          size: 1.6,
          color: colors.lightGray,
        },
      },
    ],
  },
  uniqueValueInfos: [
    {
      value: "shops",
      symbol: {
        type: "polygon-3d",
        symbolLayers: [
          {
            type: "fill",
            material: { color: colors.lighterBlue },
            size: 3,
          },
        ],
      },
      label: "Shopping area",
    },
  ],
};

export const simpleWallsRenderer = {
  type: "simple",
  symbol: {
    type: "line-3d",
    symbolLayers: [
      {
        type: "path",
        profile: "quad",
        material: { color: colors.lightBlue },
        width: 0.5,
        height: 2,
        join: "miter",
        cap: "butt",
        anchor: "bottom",
        profileRotation: "all",
      },
    ],
  },
};

export const wallsLayer = new GeoJSONLayer({
  url: "./data/shop-walls.json",
  field: ["*"],
  elevationInfo: elevationInfo,
  // renderer: {
  //   type: "unique-value",
  //   valueExpression: floorMapping.reduce(
  //     (prev, floorMap, index) =>
  //       prev +
  //       `
  //        if (Includes([${floorNames(index)}], $feature.floor)) {
  //          return "${floorMap.name}";
  //        }
  //       `,
  //     ""
  //   ),
  //   uniqueValueInfos: floorMapping.map((floor) => ({
  //     value: floor.name,
  //     symbol: {
  //       type: "line-3d",
  //       symbolLayers: [
  //         {
  //           type: "path",
  //           profile: "quad",
  //           material: { color: floor.lightColor },
  //           width: 0.5,
  //           height: 3,
  //           join: "miter",
  //           cap: "butt",
  //           anchor: "bottom",
  //           profileRotation: "all",
  //         },
  //       ],
  //     },
  //   })),
  // },
  renderer: {
    type: "simple",
    symbol: {
      type: "line-3d",
      symbolLayers: [
        {
          type: "path",
          profile: "quad",
          material: { color: colors.lightBlue },
          width: 0.5,
          height: 2,
          join: "miter",
          cap: "butt",
          anchor: "bottom",
          profileRotation: "all",
        },
      ],
    },
  },
});

const genericLabelClass = new LabelClass({
  labelExpressionInfo: {
    expression: labelExpression,
  },
  symbol: {
    type: "label-3d",
    symbolLayers: [
      {
        type: "text",
        material: {
          color: colors.darkOrange,
        },
        halo: {
          size: 1,
          color: [255, 255, 255, 1],
        },
        font: {
          size: 11,
          family:
            '"Avenir Next W00","Helvetica Neue",Helvetica,Arial,sans-serif',
        },
      },
    ],
  },
});

const publicTransportLabel = genericLabelClass.clone();
publicTransportLabel.where = `category = 'Öffentlicher Verkehr'`;
const newSymbol = publicTransportLabel.symbol.symbolLayers.getItemAt(0).clone();
newSymbol.material.color = new Color([199, 126, 0, 1]);
publicTransportLabel.symbol.symbolLayers = [newSymbol];

export function createLabels(updateFunction) {
  return [
    ...floorMapping.map((floorMap, index) => {
      const label = genericLabelClass.clone();
      label.where = `floor IN (${floorNames(
        index
      )}) AND category <> 'Öffentlicher Verkehr'`;
      const newSymbol = label.symbol.symbolLayers.getItemAt(0).clone();
      newSymbol.material.color = floorMap.textColor;
      label.symbol.symbolLayers = [newSymbol];

      if (updateFunction) {
        updateFunction(label);
      }

      return label;
    }),
    publicTransportLabel,
  ];
}

export const servicesLayer = new GeoJSONLayer({
  url: "./data/services.json",
  screenSizePerspectiveEnabled: false,
  elevationInfo: elevationInfo,
  labelingInfo: createLabels(),
  // definitionExpression: serviceCleanUp,
  renderer: {
    type: "simple",
    symbol: {
      type: "point-3d",
      symbolLayers: [
        {
          type: "icon",
          resource: { primitive: "circle" },
          material: { color: colors.darkGray },
          size: 4,
        },
      ],
      verticalOffset: {
        screenLength: 5,
        maxWorldLength: 200,
        minWorldLength: 5,
      },
      callout: {
        type: "line",
        size: 0.5,
        color: colors.darkGray,
      },
    },
  },
});

export const buildingsLayer = new SceneLayer({
  url: "https://services2.arcgis.com/cFEFS0EWrhfDeVw9/arcgis/rest/services/Zurich_Existing_Buildings_Year/SceneServer",
  outFields: ["EGID"],
  renderer: {
    type: "simple",
    symbol: {
      type: "mesh-3d",
      symbolLayers: [
        {
          type: "fill",
          material: { color: [255, 255, 255] },
          edges: {
            type: "solid",
            color: [50, 50, 50, 0.5],
            size: 1,
            extensionLength: 0,
          },
        },
      ],
    },
  },
  elevationInfo: {
    mode: "absolute-height",
    offset: 5,
  },
  definitionExpression: "EGID IN ('140889','302040593','150642')",
});

const vectorTile = new VectorTileLayer({
  url: "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer",
});

vectorTile.loadStyle("data/style.json");

export const map = new Map({
  basemap: {
    baseLayers: vectorTile,
  },
  ground: "world-elevation",
});
map.ground.navigationConstraint = {
  type: "none",
};
map.ground.surfaceColor = "white";
map.layers.addMany([areasLayer, servicesLayer]); // buildingsLayer

export const commonSceneConfig = {
  container: "viewDiv",
  viewingMode: "global",
  map: map,
  qualityProfile: "high",
  camera: {
    position: [8.54341317, 47.3755645, 566.11708],
    heading: 314.1,
    tilt: 66.12,
  },
  //clippingArea: stationExtent,
  alphaCompositingEnabled: true,
  // spatialReference: {
  //   wkid: 102100
  // },
  popup: {
    defaultPopupTemplateEnabled: true,
  },
  environment: {
    background: {
      type: "color",
      color: [255, 255, 255, 0],
    },
    starsEnabled: false,
    atmosphereEnabled: false,
    // lighting: {
    //   type: "virtual",
    // },
  },
};

const planeHeight = 2;
export const planeLayer = new GraphicsLayer({
  elevationInfo: {
    mode: "relative-to-ground",
    offset: floorMapping[0].elevation - planeHeight - 1,
  },
});
const polygonRings = [
  [8.53418, 47.38077, 0],
  [8.53252, 47.37848, 0],
  [8.54158, 47.37569, 0],
  [8.54302, 47.37842, 0],
  [8.53418, 47.38077, 0],
];
const graphic = new Graphic({
  symbol: {
    type: "polygon-3d",
    symbolLayers: [
      {
        type: "extrude",
        material: { color: [255, 255, 255, 0.8] },
        size: planeHeight,
        edges: {
          type: "solid",
          color: [70, 70, 70, 0.5],
          size: 1,
        },
      },
    ],
  },
  geometry: new Polygon({
    rings: polygonRings,
    spatialReference: 4326,
  }),
});
planeLayer.add(graphic);

// view.whenLayerView(buildingsLayer).then(function (lyrView) {
//   lyrView.filter = {
//     geometry: extent,
//     spatialRelationship: "intersects",
//   };
// });

function updateRenderer(layer, updateFunction) {
  const newRenderer = layer.renderer.clone();
  updateFunction(newRenderer);
  layer.renderer = newRenderer;
}

export function fadeFloor(floor) {
  const expression = `IIf(Includes([${floorNames(
    floor
  )}], $feature.floor), 1, 0.1)`;
  const opacityVariable = {
    type: "opacity",
    stops: [
      { value: 0.1, opacity: 0.1 },
      { value: 1, opacity: 1 },
    ],
    valueExpression: expression,
  };
  updateRenderer(
    areasLayer,
    (newRenderer) => (newRenderer.visualVariables = [opacityVariable])
  );
  updateRenderer(
    wallsLayer,
    (newRenderer) => (newRenderer.visualVariables = [opacityVariable])
  );
  // All floors above, remove:
  let definitionExpression = "";
  let floorAbove = floor - 1;
  while (floorAbove > 0) {
    // 0, and 1 are the ground floor
    if (definitionExpression !== "") {
      definitionExpression += " AND ";
    }
    definitionExpression += `floor NOT IN (${floorMapping[
      floorAbove
    ].originalNames
      .map((name) => `'${name}'`)
      .join(", ")})`;
    floorAbove -= 1;
  }
  areasLayer.definitionExpression = definitionExpression;
  wallsLayer.definitionExpression = definitionExpression;

  servicesLayer.definitionExpression = `floor IN (${floorNames(floor)})`;
  const newElevationInfo = planeLayer.elevationInfo.clone();
  newElevationInfo.offset = floorMapping[floor].elevation - planeHeight - 1;
  planeLayer.elevationInfo = newElevationInfo;
}

export default commonSceneConfig;
