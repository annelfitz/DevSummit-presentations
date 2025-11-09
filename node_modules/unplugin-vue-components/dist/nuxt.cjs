const require_utils = require('./utils-BIvt10am.cjs');
const require_src = require('./src-C_roJwTj.cjs');
require('./types-CBTc19th.cjs');
const __nuxt_kit = require_utils.__toESM(require("@nuxt/kit"));

//#region src/nuxt.ts
var nuxt_default = (0, __nuxt_kit.defineNuxtModule)({ setup(options) {
	(0, __nuxt_kit.addWebpackPlugin)(require_src.unplugin_default.webpack(options));
	(0, __nuxt_kit.addVitePlugin)(require_src.unplugin_default.vite(options));
} });

//#endregion
module.exports = nuxt_default;