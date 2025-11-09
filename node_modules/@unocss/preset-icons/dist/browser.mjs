import { loadIcon } from '@iconify/utils';
import { c as createCDNLoader } from './shared/preset-icons.CxZeN9-o.mjs';
import { c as createPresetIcons, b as createCDNFetchLoader } from './shared/preset-icons.DIW0qOxJ.mjs';
export { a as combineLoaders, i as icons, p as parseIconWithLoader } from './shared/preset-icons.DIW0qOxJ.mjs';
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
    return await createCDNLoader(cdn);
  return loadIcon;
});

export { createCDNFetchLoader, createPresetIcons, presetIcons as default, presetIcons };
