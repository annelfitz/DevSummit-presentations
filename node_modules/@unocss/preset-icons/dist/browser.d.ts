import * as _unocss_core from '@unocss/core';
import { IconsOptions } from './core.js';
export { IconsAPI, combineLoaders, createCDNFetchLoader, createPresetIcons, icons, parseIconWithLoader } from './core.js';
import '@iconify/types';
import '@iconify/utils';
import '@iconify/utils/lib/svg/encode-svg-for-css';

declare const presetIcons: _unocss_core.PresetFactory<object, IconsOptions>;

export { IconsOptions, presetIcons as default, presetIcons };
