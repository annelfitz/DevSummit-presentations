import { Options, PublicPluginAPI } from "./types-BED632qH.cjs";
import { Plugin } from "vite";

//#region src/vite.d.ts
declare const _default: (options?: Options | undefined) => Plugin & {
  api: PublicPluginAPI;
};
//#endregion
export { _default as default };