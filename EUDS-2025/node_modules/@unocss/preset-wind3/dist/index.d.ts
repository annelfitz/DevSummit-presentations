import * as _unocss_core from '@unocss/core';
import { Variant } from '@unocss/core';
import * as _unocss_preset_mini from '@unocss/preset-mini';
import { Theme, PresetMiniOptions } from '@unocss/preset-mini';
export { Theme, colors, preflights } from '@unocss/preset-mini';
export { shortcuts } from './shortcuts.js';
export { theme } from './theme.js';
export { r as rules } from './shared/preset-wind3.DRADYSMV.js';

declare function variants(options: PresetWind3Options): Variant<Theme>[];

interface PresetWind3Options extends PresetMiniOptions {
    /**
     * The important option lets you control whether UnoCSS’s utilities should be marked with `!important`.
     *
     * This can be really useful when using UnoCSS with existing CSS that has high specificity selectors.
     *
     * You can also set `important` to a selector like `#app` instead, which will generate `#app :is(.m-1) { ... }`
     *
     * Also check out the compatibility with [:is()](https://caniuse.com/?search=%3Ais())
     *
     * @default false
     */
    important?: boolean | string;
}
/**
 * The Tailwind CSS v3 / Windi CSS compact preset for UnoCSS.
 *
 * @see https://unocss.dev/presets/wind
 */
declare const presetWind3: _unocss_core.PresetFactory<_unocss_preset_mini.Theme, PresetWind3Options>;

export { type PresetWind3Options, presetWind3 as default, presetWind3 as presetWind, presetWind3, variants };
