"use strict";Object.defineProperty(exports, "__esModule", {value: true});require('./chunk-ORVFCRDG.cjs');

// src/loaders.ts
var _externalpkg = require('@iconify/utils/lib/loader/external-pkg');
var _nodeloaders = require('@iconify/utils/lib/loader/node-loaders');
function FileSystemIconLoader(dir, transform) {
  return _nodeloaders.FileSystemIconLoader.call(void 0, dir, transform);
}
function ExternalPackageIconLoader(packageName, autoInstall) {
  return _externalpkg.createExternalPackageIconLoader.call(void 0, packageName, autoInstall);
}



exports.ExternalPackageIconLoader = ExternalPackageIconLoader; exports.FileSystemIconLoader = FileSystemIconLoader;
