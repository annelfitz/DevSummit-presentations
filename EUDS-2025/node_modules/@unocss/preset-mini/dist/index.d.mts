import * as _unocss_core from '@unocss/core';
import { Preflight, PresetOptions, Postprocessor } from '@unocss/core';
import { T as Theme } from './shared/preset-mini.BjJC-NnU.mjs';
export { a as ThemeAnimation } from './shared/preset-mini.BjJC-NnU.mjs';
export { colors } from './colors.mjs';
export { t as theme } from './shared/preset-mini.BSnAbT9I.mjs';
export { p as parseColor } from './shared/preset-mini.oF7XTPi1.mjs';
import '@unocss/rule-utils';

declare function preflights(options: PresetMiniOptions): Preflight<Theme>[] | undefined;

interface DarkModeSelectors {
    /**
     * Selectors for light variant.
     *
     * @default '.light'
     */
    light?: string | string[];
    /**
     * Selectors for dark variant.
     *
     * @default '.dark'
     */
    dark?: string | string[];
}
interface PresetMiniOptions extends PresetOptions {
    /**
     * Dark mode options
     *
     * @default 'class'
     */
    dark?: 'class' | 'media' | DarkModeSelectors;
    /**
     * Generate tagged pseudo selector as `[group=""]` instead of `.group`
     *
     * @default false
     */
    attributifyPseudo?: boolean;
    /**
     * Prefix for CSS variables.
     *
     * @default 'un-'
     */
    variablePrefix?: string;
    /**
     * Utils prefix. When using tagged pseudo selector, only the first truthy prefix will be used.
     *
     * @default undefined
     */
    prefix?: string | string[];
    /**
     * Generate preflight
     *
     * @default true
     */
    preflight?: boolean | 'on-demand';
    /**
     * Enable arbitrary variants, for example `<div class="[&>*]:m-1 [&[open]]:p-2"></div>`.
     *
     * Disable this might slightly improve the performance.
     *
     * @default true
     */
    arbitraryVariants?: boolean;
}
/**
 * The basic preset for UnoCSS, with only the most essential utilities.
 *
 * @see https://unocss.dev/presets/mini
 */
declare const presetMini: _unocss_core.PresetFactory<Theme, PresetMiniOptions>;

declare function VarPrefixPostprocessor(prefix: string): Postprocessor | undefined;

export { Theme, VarPrefixPostprocessor, presetMini as default, preflights, presetMini };
export type { DarkModeSelectors, PresetMiniOptions };
