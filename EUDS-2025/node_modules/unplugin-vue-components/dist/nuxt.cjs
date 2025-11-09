"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunk34OWILDZcjs = require('./chunk-34OWILDZ.cjs');
require('./chunk-6XRV7GTU.cjs');
require('./chunk-3HT76LNN.cjs');
require('./chunk-ZBPRDZS4.cjs');

// src/nuxt.ts
var _kit = require('@nuxt/kit');
var nuxt_default = _kit.defineNuxtModule.call(void 0, {
  setup(options) {
    _kit.addWebpackPlugin.call(void 0, _chunk34OWILDZcjs.unplugin_default.webpack(options));
    _kit.addVitePlugin.call(void 0, _chunk34OWILDZcjs.unplugin_default.vite(options));
  }
});


exports.default = nuxt_default;
