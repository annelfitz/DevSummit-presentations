import * as _unocss_core from '@unocss/core';
import { Postprocessor, Preflight, Variant, PresetOptions, Arrayable, CSSEntry, PreflightContext } from '@unocss/core';
import { T as Theme } from './shared/preset-wind4.CeNzqhCV.mjs';
export { r as rules } from './shared/preset-wind4.O8irdiHr.mjs';
export { shortcuts } from './shortcuts.mjs';
export { t as theme } from './shared/preset-wind4.VVeg6taI.mjs';

declare function postprocessors(options: PresetWind4Options): Postprocessor[];

declare const preflights: (options: PresetWind4Options) => Preflight<Theme>[];

declare const shorthands: {
    position: string[];
    globalKeyword: string[];
};

declare function variants(options: PresetWind4Options): Variant<Theme>[];

interface DarkModeSelectors {
    /**
     * Selector for light variant.
     *
     * @default '.light'
     */
    light?: string;
    /**
     * Selector for dark variant.
     *
     * @default '.dark'
     */
    dark?: string;
}
interface PreflightsTheme {
    /**
     * Generate theme keys as CSS variables.
     *
     * - `true`: Generate theme keys fully.
     * - `false`: Disable theme keys. (Not recommended ⚠️)
     * - `'on-demand'`: Generate theme keys only when used.
     *
     * @default 'on-demand'
     */
    mode?: boolean | 'on-demand';
    /**
     * Process the theme keys.
     */
    process?: Arrayable<(entry: CSSEntry, ctx: PreflightContext<Theme>) => void>;
}
interface PresetWind4Options extends PresetOptions {
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
     * Enable arbitrary variants, for example `<div class="[&>*]:m-1 [&[open]]:p-2"></div>`.
     *
     * Disable this might slightly improve the performance.
     *
     * @default true
     */
    arbitraryVariants?: boolean;
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
    /**
     * Control the preflight styles.
     */
    preflights?: {
        /**
         * Reset the default preflight styles.
         *
         * @default true
         */
        reset?: boolean;
        /**
         * Theme configuration for preflight styles.
         *
         * This can either be a specific mode from `PreflightsTheme['mode']` or a full `PreflightsTheme` object.
         *
         * The theme defines the base styles applied to elements and can be customized
         * to match the design system or requirements of your project.
         */
        theme?: PreflightsTheme['mode'] | PreflightsTheme;
        /**
         * Configuration for property preflight generation.
         *
         * - `false`: Disable property preflight
         * - `true` or `undefined`: Enable with default configuration
         * - `object`: Enable with custom configuration
         */
        property?: boolean | {
            /**
             * Custom parent selector (e.g., @supports query or @layer).
             *
             * - `string`: Use custom parent selector
             * - `false`: No parent wrapper, apply properties directly to selector
             * - `undefined`: Use default @supports query
             *
             * @default '@supports ((-webkit-hyphens: none) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color:rgb(from red r g b))))'
             */
            parent?: string | false;
            /**
             * Custom selector for applying properties.
             *
             * @default '*, ::before, ::after, ::backdrop'
             */
            selector?: string;
        };
    };
}
declare const presetWind4: _unocss_core.PresetFactory<Theme, PresetWind4Options>;

export { Theme, presetWind4 as default, postprocessors, preflights, presetWind4, shorthands, variants };
export type { DarkModeSelectors, PreflightsTheme, PresetWind4Options };
