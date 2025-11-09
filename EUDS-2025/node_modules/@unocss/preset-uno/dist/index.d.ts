import * as _unocss_core from '@unocss/core';
import { Theme, PresetWind3Options } from '@unocss/preset-wind3';
export { Theme } from '@unocss/preset-wind3';

interface PresetUnoOptions extends PresetWind3Options {
}
/**
 * @deprecated Use `presetWind3` from `@unocss/preset-wind3` instead
 */
declare const presetUno: _unocss_core.PresetFactory<Theme, PresetUnoOptions>;

export { type PresetUnoOptions, presetUno as default, presetUno };
