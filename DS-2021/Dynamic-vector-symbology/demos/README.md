# CIM Symbol JSON

The following symbol JSON can be used in the 'data.symbol' property of the CIM Symbol class.

```js
const cimSymbol = new CIMSymbol({
    data: {
        type: "CIMSymbolReference",
        symbol: // enter symbol JSON here!!
    }
})
```

Or, if you are autocasting the CIM symbol on the renderer, it will look something like this:

```js
featureLayer.renderer = {
    type: "simple",
    symbol: {
        type: "cim",
        data: {
            type: "CIMSymbolReference",
            symbol: // enter symbol JSON here!! 
        }
    }
}
```

## Point Symbols

### CIM Picture Marker

![esri picture marker](img/pictureMarker.png)

```json
{
  "type": "CIMPointSymbol",
  "symbolLayers": [
    {
      "type": "CIMPictureMarker",
      "enable": true,
      "anchorPoint": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "anchorPointUnits": "Relative",
      "dominantSizeAxis3D": "Y",
      "size": 40,
      "billboardMode3D": "FaceNearPlane",
      "invertBackfaceTexture": true,
      "scaleX": 1,
      "textureFilter": "Picture",
      "tintColor": [
        255,
        255,
        255,
        255
      ],
      "url": "https://logos-download.com/wp-content/uploads/2016/11/ESRI_logo_logotype.png"
    }
  ]
}
```

### CIM Vector Marker

![vector marker](img/vectorMarker.png)

```json
{
  "type": "CIMPointSymbol",
  "symbolLayers": [
    {
      "type": "CIMVectorMarker",
      "enable": true,
      "anchorPoint": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "anchorPointUnits": "Relative",
      "dominantSizeAxis3D": "Y",
      "size": 25,
      "billboardMode3D": "FaceNearPlane",
      "frame": {
        "xmin": 0,
        "ymin": 0,
        "xmax": 66,
        "ymax": 133
      },
      "markerGraphics": [
        {
          "type": "CIMMarkerGraphic",
          "geometry": {
            "rings": [
              [
                [
                  33,
                  132
                ],
                [
                  25.4,
                  131.6
                ],
                [
                  18.8,
                  130.3
                ],
                [
                  13.1,
                  128.2
                ],
                [
                  8.5,
                  125.3
                ],
                [
                  4.9,
                  121.5
                ],
                [
                  2.4,
                  117
                ],
                [
                  0.8,
                  111.6
                ],
                [
                  0.3,
                  105.4
                ],
                [
                  0.3,
                  35.8
                ],
                [
                  33,
                  1
                ],
                [
                  65.8,
                  35.8
                ],
                [
                  65.8,
                  105.4
                ],
                [
                  65.3,
                  111.6
                ],
                [
                  63.7,
                  117
                ],
                [
                  61.2,
                  121.5
                ],
                [
                  57.5,
                  125.3
                ],
                [
                  52.9,
                  128.2
                ],
                [
                  47.3,
                  130.3
                ],
                [
                  40.6,
                  131.6
                ],
                [
                  33,
                  132
                ]
              ],
              [
                [
                  33,
                  73
                ],
                [
                  29.9,
                  73.3
                ],
                [
                  26.8,
                  74.1
                ],
                [
                  24,
                  75.5
                ],
                [
                  21.4,
                  77.3
                ],
                [
                  19.2,
                  79.5
                ],
                [
                  17.4,
                  82.1
                ],
                [
                  16.1,
                  84.9
                ],
                [
                  15.3,
                  88
                ],
                [
                  15,
                  91.1
                ],
                [
                  16.3,
                  98.1
                ],
                [
                  20.2,
                  104.1
                ],
                [
                  26,
                  108.1
                ],
                [
                  33,
                  109.5
                ],
                [
                  35.9,
                  109.3
                ],
                [
                  38.6,
                  108.6
                ],
                [
                  41.3,
                  107.5
                ],
                [
                  43.7,
                  105.9
                ],
                [
                  45.8,
                  104.1
                ],
                [
                  47.7,
                  101.9
                ],
                [
                  49.1,
                  99.4
                ],
                [
                  50.2,
                  96.7
                ],
                [
                  50.8,
                  94
                ],
                [
                  51,
                  91.1
                ],
                [
                  50.7,
                  88
                ],
                [
                  49.9,
                  84.9
                ],
                [
                  48.6,
                  82.1
                ],
                [
                  46.8,
                  79.5
                ],
                [
                  44.6,
                  77.3
                ],
                [
                  42,
                  75.5
                ],
                [
                  39.2,
                  74.1
                ],
                [
                  36.1,
                  73.3
                ],
                [
                  33,
                  73
                ]
              ]
            ]
          },
          "symbol": {
            "type": "CIMPolygonSymbol",
            "symbolLayers": [
              {
                "type": "CIMSolidFill",
                "enable": true,
                "color": [
                  39,
                  129,
                  153,
                  255
                ]
              }
            ]
          }
        }
      ],
      "scaleSymbolsProportionally": true,
      "respectFrame": true,
      "clippingPath": {
        "type": "CIMClippingPath",
        "clippingType": "Intersect",
        "path": {
          "rings": [
            [
              [
                0,
                0
              ],
              [
                66,
                0
              ],
              [
                66,
                133
              ],
              [
                0,
                133
              ],
              [
                0,
                0
              ]
            ]
          ]
        }
      }
    },
    {
      "type": "CIMVectorMarker",
      "enable": true,
      "anchorPoint": {
        "x": 0,
        "y": 4.5
      },
      "anchorPointUnits": "Relative",
      "dominantSizeAxis3D": "Y",
      "size": 3,
      "billboardMode3D": "FaceNearPlane",
      "frame": {
        "xmin": 0,
        "ymin": 0,
        "xmax": 39.7,
        "ymax": 17
      },
      "markerGraphics": [
        {
          "type": "CIMMarkerGraphic",
          "geometry": {
            "rings": [
              [
                [
                  32.2,
                  0
                ],
                [
                  7.4,
                  0
                ],
                [
                  6,
                  0.2
                ],
                [
                  4.6,
                  0.6
                ],
                [
                  3.3,
                  1.4
                ],
                [
                  2.2,
                  2.5
                ],
                [
                  1.2,
                  3.8
                ],
                [
                  0.6,
                  5.2
                ],
                [
                  0.1,
                  6.8
                ],
                [
                  0,
                  8.5
                ],
                [
                  0.1,
                  10.2
                ],
                [
                  0.6,
                  11.8
                ],
                [
                  1.2,
                  13.2
                ],
                [
                  2.2,
                  14.5
                ],
                [
                  3.3,
                  15.6
                ],
                [
                  4.6,
                  16.4
                ],
                [
                  6,
                  16.8
                ],
                [
                  7.4,
                  17
                ],
                [
                  32.2,
                  17
                ],
                [
                  33.7,
                  16.8
                ],
                [
                  35.1,
                  16.4
                ],
                [
                  36.4,
                  15.6
                ],
                [
                  37.5,
                  14.5
                ],
                [
                  38.4,
                  13.2
                ],
                [
                  39.1,
                  11.7
                ],
                [
                  39.6,
                  10.2
                ],
                [
                  39.7,
                  8.5
                ],
                [
                  39.6,
                  6.8
                ],
                [
                  39.1,
                  5.3
                ],
                [
                  38.4,
                  3.8
                ],
                [
                  37.5,
                  2.5
                ],
                [
                  36.4,
                  1.4
                ],
                [
                  35.1,
                  0.6
                ],
                [
                  33.7,
                  0.2
                ],
                [
                  32.2,
                  0
                ]
              ]
            ]
          },
          "symbol": {
            "type": "CIMPolygonSymbol",
            "symbolLayers": [
              {
                "type": "CIMSolidStroke",
                "enable": true,
                "capStyle": "Round",
                "joinStyle": "Round",
                "lineStyle3D": "Strip",
                "miterLimit": 10,
                "width": 0,
                "color": [
                  0,
                  0,
                  0,
                  255
                ]
              },
              {
                "type": "CIMSolidFill",
                "enable": true,
                "color": [
                  170,
                  170,
                  170,
                  255
                ]
              }
            ]
          }
        }
      ],
      "scaleSymbolsProportionally": true,
      "respectFrame": true
    }
  ]
}
```

### Vector Marker with Text

![vector marker with text](img/vectorMarkerWithText.png)

```json
{
  "type": "CIMPointSymbol",
  "symbolLayers": [
    {
      "type": "CIMVectorMarker",
      "enable": true,
      "size": 10,
      "colorLocked": true,
      "anchorPointUnits": "Relative",
      "frame": {
        "xmin": -5,
        "ymin": -5,
        "xmax": 5,
        "ymax": 5
      },
      "markerGraphics": [
        {
          "type": "CIMMarkerGraphic",
          "geometry": {
            "x": 0,
            "y": 0
          },
          "symbol": {
            "type": "CIMTextSymbol",
            "fontFamilyName": "Arial",
            "fontStyleName": "Bold",
            "height": 10,
            "horizontalAlignment": "Center",
            "offsetX": 0,
            "offsetY": -22,
            "symbol": {
              "type": "CIMPolygonSymbol",
              "symbolLayers": [
                {
                  "type": "CIMSolidFill",
                  "enable": true,
                  "color": [
                    17,
                    56,
                    146,
                    255
                  ]
                }
              ]
            },
            "verticalAlignment": "Center",
            "font": {
              "family": "Arial",
              "decoration": "none",
              "style": "normal",
              "weight": "bold"
            }
          },
          "textString": "you are here!"
        }
      ],
      "scaleSymbolsProportionally": true,
      "respectFrame": true,
      "offsetY": 0
    },
    {
      "type": "CIMVectorMarker",
      "enable": true,
      "anchorPoint": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "anchorPointUnits": "Relative",
      "dominantSizeAxis3D": "Y",
      "size": 25,
      "billboardMode3D": "FaceNearPlane",
      "frame": {
        "xmin": 0,
        "ymin": 0,
        "xmax": 66,
        "ymax": 133
      },
      "markerGraphics": [
        {
          "type": "CIMMarkerGraphic",
          "geometry": {
            "rings": [
              [
                [
                  33,
                  132
                ],
                [
                  25.4,
                  131.6
                ],
                [
                  18.8,
                  130.3
                ],
                [
                  13.1,
                  128.2
                ],
                [
                  8.5,
                  125.3
                ],
                [
                  4.9,
                  121.5
                ],
                [
                  2.4,
                  117
                ],
                [
                  0.8,
                  111.6
                ],
                [
                  0.3,
                  105.4
                ],
                [
                  0.3,
                  35.8
                ],
                [
                  33,
                  1
                ],
                [
                  65.8,
                  35.8
                ],
                [
                  65.8,
                  105.4
                ],
                [
                  65.3,
                  111.6
                ],
                [
                  63.7,
                  117
                ],
                [
                  61.2,
                  121.5
                ],
                [
                  57.5,
                  125.3
                ],
                [
                  52.9,
                  128.2
                ],
                [
                  47.3,
                  130.3
                ],
                [
                  40.6,
                  131.6
                ],
                [
                  33,
                  132
                ]
              ],
              [
                [
                  33,
                  73
                ],
                [
                  29.9,
                  73.3
                ],
                [
                  26.8,
                  74.1
                ],
                [
                  24,
                  75.5
                ],
                [
                  21.4,
                  77.3
                ],
                [
                  19.2,
                  79.5
                ],
                [
                  17.4,
                  82.1
                ],
                [
                  16.1,
                  84.9
                ],
                [
                  15.3,
                  88
                ],
                [
                  15,
                  91.1
                ],
                [
                  16.3,
                  98.1
                ],
                [
                  20.2,
                  104.1
                ],
                [
                  26,
                  108.1
                ],
                [
                  33,
                  109.5
                ],
                [
                  35.9,
                  109.3
                ],
                [
                  38.6,
                  108.6
                ],
                [
                  41.3,
                  107.5
                ],
                [
                  43.7,
                  105.9
                ],
                [
                  45.8,
                  104.1
                ],
                [
                  47.7,
                  101.9
                ],
                [
                  49.1,
                  99.4
                ],
                [
                  50.2,
                  96.7
                ],
                [
                  50.8,
                  94
                ],
                [
                  51,
                  91.1
                ],
                [
                  50.7,
                  88
                ],
                [
                  49.9,
                  84.9
                ],
                [
                  48.6,
                  82.1
                ],
                [
                  46.8,
                  79.5
                ],
                [
                  44.6,
                  77.3
                ],
                [
                  42,
                  75.5
                ],
                [
                  39.2,
                  74.1
                ],
                [
                  36.1,
                  73.3
                ],
                [
                  33,
                  73
                ]
              ]
            ]
          },
          "symbol": {
            "type": "CIMPolygonSymbol",
            "symbolLayers": [
              {
                "type": "CIMSolidFill",
                "enable": true,
                "color": [
                  39,
                  129,
                  153,
                  255
                ]
              }
            ]
          }
        }
      ],
      "scaleSymbolsProportionally": true,
      "respectFrame": true,
      "clippingPath": {
        "type": "CIMClippingPath",
        "clippingType": "Intersect",
        "path": {
          "rings": [
            [
              [
                0,
                0
              ],
              [
                66,
                0
              ],
              [
                66,
                133
              ],
              [
                0,
                133
              ],
              [
                0,
                0
              ]
            ]
          ]
        }
      }
    },
    {
      "type": "CIMVectorMarker",
      "enable": true,
      "anchorPoint": {
        "x": 0,
        "y": 4.5
      },
      "anchorPointUnits": "Relative",
      "dominantSizeAxis3D": "Y",
      "size": 3,
      "billboardMode3D": "FaceNearPlane",
      "frame": {
        "xmin": 0,
        "ymin": 0,
        "xmax": 39.7,
        "ymax": 17
      },
      "markerGraphics": [
        {
          "type": "CIMMarkerGraphic",
          "geometry": {
            "rings": [
              [
                [
                  32.2,
                  0
                ],
                [
                  7.4,
                  0
                ],
                [
                  6,
                  0.2
                ],
                [
                  4.6,
                  0.6
                ],
                [
                  3.3,
                  1.4
                ],
                [
                  2.2,
                  2.5
                ],
                [
                  1.2,
                  3.8
                ],
                [
                  0.6,
                  5.2
                ],
                [
                  0.1,
                  6.8
                ],
                [
                  0,
                  8.5
                ],
                [
                  0.1,
                  10.2
                ],
                [
                  0.6,
                  11.8
                ],
                [
                  1.2,
                  13.2
                ],
                [
                  2.2,
                  14.5
                ],
                [
                  3.3,
                  15.6
                ],
                [
                  4.6,
                  16.4
                ],
                [
                  6,
                  16.8
                ],
                [
                  7.4,
                  17
                ],
                [
                  32.2,
                  17
                ],
                [
                  33.7,
                  16.8
                ],
                [
                  35.1,
                  16.4
                ],
                [
                  36.4,
                  15.6
                ],
                [
                  37.5,
                  14.5
                ],
                [
                  38.4,
                  13.2
                ],
                [
                  39.1,
                  11.7
                ],
                [
                  39.6,
                  10.2
                ],
                [
                  39.7,
                  8.5
                ],
                [
                  39.6,
                  6.8
                ],
                [
                  39.1,
                  5.3
                ],
                [
                  38.4,
                  3.8
                ],
                [
                  37.5,
                  2.5
                ],
                [
                  36.4,
                  1.4
                ],
                [
                  35.1,
                  0.6
                ],
                [
                  33.7,
                  0.2
                ],
                [
                  32.2,
                  0
                ]
              ]
            ]
          },
          "symbol": {
            "type": "CIMPolygonSymbol",
            "symbolLayers": [
              {
                "type": "CIMSolidStroke",
                "enable": true,
                "capStyle": "Round",
                "joinStyle": "Round",
                "lineStyle3D": "Strip",
                "miterLimit": 10,
                "width": 0,
                "color": [
                  0,
                  0,
                  0,
                  255
                ]
              },
              {
                "type": "CIMSolidFill",
                "enable": true,
                "color": [
                  170,
                  170,
                  170,
                  255
                ]
              }
            ]
          }
        }
      ],
      "scaleSymbolsProportionally": true,
      "respectFrame": true
    }
  ]
}
```