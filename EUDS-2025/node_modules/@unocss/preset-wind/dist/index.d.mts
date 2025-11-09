import * as _unocss_core from '@unocss/core';
import { Theme, PresetWind3Options } from '@unocss/preset-wind3';
export { Theme } from '@unocss/preset-wind3';

interface PresetWindOptions extends PresetWind3Options {
}
/**
 * @deprecated Use `presetWind3` from `@unocss/preset-wind3` instead
 */
declare const presetWind: _unocss_core.PresetFactory<Theme, PresetWindOptions>;

export { type PresetWindOptions, presetWind as default, presetWind };
