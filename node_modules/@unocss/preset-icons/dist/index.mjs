import { c as createPresetIcons, g as getEnvFlags, a as combineLoaders } from './shared/preset-icons.DIW0qOxJ.mjs';
export { b as createCDNFetchLoader, i as icons, p as parseIconWithLoader } from './shared/preset-icons.DIW0qOxJ.mjs';
import { loadIcon } from '@iconify/utils';
import { definePreset } from '@unocss/core';
import { c as createCDNLoader } from './shared/preset-icons.CxZeN9-o.mjs';
import '@iconify/utils/lib/loader/loader';
import '@iconify/utils/lib/loader/modern';
import '@iconify/utils/lib/svg/encode-svg-for-css';

const _factory = /* @__PURE__ */ createPresetIcons(async (options) => {
  const {
    cdn
  } = options;
  const loaders = [];
  const {
    isNode,
    isVSCode,
    isESLint
  } = getEnvFlags();
  if (isNode && !isVSCode && !isESLint) {
    const nodeLoader = await createNodeLoader();
    if (nodeLoader !== void 0)
      loaders.push(nodeLoader);
  }
  if (cdn)
    loaders.push(await createCDNLoader(cdn));
  loaders.push(loadIcon);
  return combineLoaders(loaders);
});
const presetIcons = /* @__PURE__ */ definePreset((options = {}) => {
  const preset = _factory(options);
  const api = preset.api;
  api.createNodeLoader = createNodeLoader;
  return preset;
});
async function createNodeLoader() {
  try {
    return await import('@iconify/utils/lib/loader/node-loader').then((i) => i?.loadNodeIcon);
  } catch {
  }
  try {
    return require("@iconify/utils/lib/loader/node-loader.cjs").loadNodeIcon;
  } catch {
  }
}

export { combineLoaders, createNodeLoader, createPresetIcons, presetIcons as default, presetIcons };
