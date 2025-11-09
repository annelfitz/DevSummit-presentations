import { Variant, VariantObject, VariantFunction } from '@unocss/core';
export { variants } from './index.mjs';
import '@unocss/preset-mini';
import './shortcuts.mjs';
import './theme.mjs';
import './shared/preset-wind3.DRADYSMV.mjs';

declare const variantCombinators: Variant[];

declare const variantColorsScheme: Variant[];

declare const variantContrasts: Variant[];
declare const variantMotions: Variant[];
declare const variantOrientations: Variant[];

declare const variantSpaceAndDivide: Variant;
declare const variantStickyHover: Variant[];

/**
 * Shade the color if the weight is positive, tint the color otherwise.
 * Shading mixes the color with black, Tinting mixes the color with white.
 * @see {@link mixColor}
 */
declare function variantColorMix<Theme extends object>(): VariantObject<Theme>;

declare const placeholderModifier: VariantFunction;

export { placeholderModifier, variantColorMix, variantColorsScheme, variantCombinators, variantContrasts, variantMotions, variantOrientations, variantSpaceAndDivide, variantStickyHover };
