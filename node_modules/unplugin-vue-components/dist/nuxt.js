import "./utils-DuLwPrUJ.js";
import { unplugin_default } from "./src-B9aLSEVj.js";
import "./types-Cv8NMtbo.js";
import { addVitePlugin, addWebpackPlugin, defineNuxtModule } from "@nuxt/kit";

//#region src/nuxt.ts
var nuxt_default = defineNuxtModule({ setup(options) {
	addWebpackPlugin(unplugin_default.webpack(options));
	addVitePlugin(unplugin_default.vite(options));
} });

//#endregion
export { nuxt_default as default };