import { loadIcon } from '@iconify/utils';
import { c as createCDNLoader } from './shared/preset-icons.DE2iazBM.mjs';
import { createPresetIcons, createCDNFetchLoader } from './core.mjs';
export { combineLoaders, getEnvFlags, icons, parseIconWithLoader } from './core.mjs';
import 'ofetch';
import '@iconify/utils/lib/loader/loader';
import '@iconify/utils/lib/loader/modern';
import '@iconify/utils/lib/svg/encode-svg-for-css';
import '@unocss/core';

const presetIcons = createPresetIcons(async (options) => {
  const fetcher = options?.customFetch;
  const cdn = options?.cdn;
  if (fetcher && cdn)
    return createCDNFetchLoader(fetcher, cdn);
  if (cdn)
    return createCDNLoader(cdn);
  return loadIcon;
});

export { createCDNFetchLoader, createPresetIcons, presetIcons as default, presetIcons };
