import { Rule, Shortcut } from '@unocss/core';
import { Theme } from '@unocss/preset-mini';
export { r as rules } from './shared/preset-wind3.DRADYSMV.js';

declare const animations: Rule<Theme>[];

declare const backgroundStyles: Rule[];

declare const listStyle: Rule[];
declare const accents: Rule[];
declare const carets: Rule[];
declare const imageRenderings: Rule[];
declare const overscrolls: Rule[];
declare const scrollBehaviors: Rule[];

declare const columns: Rule[];

declare const container: Rule<Theme>[];
declare const containerShortcuts: Shortcut<Theme>[];

declare const divides: Rule[];

declare const filterBase: {
    '--un-blur': string;
    '--un-brightness': string;
    '--un-contrast': string;
    '--un-drop-shadow': string;
    '--un-grayscale': string;
    '--un-hue-rotate': string;
    '--un-invert': string;
    '--un-saturate': string;
    '--un-sepia': string;
};
declare const backdropFilterBase: {
    '--un-backdrop-blur': string;
    '--un-backdrop-brightness': string;
    '--un-backdrop-contrast': string;
    '--un-backdrop-grayscale': string;
    '--un-backdrop-hue-rotate': string;
    '--un-backdrop-invert': string;
    '--un-backdrop-opacity': string;
    '--un-backdrop-saturate': string;
    '--un-backdrop-sepia': string;
};
declare const filters: Rule<Theme>[];

declare const lineClamps: Rule[];

declare const placeholders: Rule[];

declare const scrollSnapTypeBase: {
    '--un-scroll-snap-strictness': string;
};
declare const scrolls: Rule[];

declare const spaces: Rule[];

declare const textTransforms: Rule[];
declare const hyphens: Rule[];
declare const writingModes: Rule[];
declare const writingOrientations: Rule[];
declare const screenReadersAccess: Rule[];
declare const isolations: Rule[];
declare const objectPositions: Rule[];
declare const backgroundBlendModes: Rule[];
declare const mixBlendModes: Rule[];
declare const dynamicViewportHeight: Rule[];

declare const borderSpacingBase: {
    '--un-border-spacing-x': number;
    '--un-border-spacing-y': number;
};
declare const tables: Rule<Theme>[];

declare const touchActionBase: {
    '--un-pan-x': string;
    '--un-pan-y': string;
    '--un-pinch-zoom': string;
};
declare const touchActions: Rule[];

declare const fontVariantNumericBase: {
    '--un-ordinal': string;
    '--un-slashed-zero': string;
    '--un-numeric-figure': string;
    '--un-numeric-spacing': string;
    '--un-numeric-fraction': string;
};
declare const fontVariantNumeric: Rule[];

declare const cssVariables: Rule[];

declare const viewTransition: Rule[];

export { accents, animations, backdropFilterBase, backgroundBlendModes, backgroundStyles, borderSpacingBase, carets, columns, container, containerShortcuts, cssVariables, divides, dynamicViewportHeight, filterBase, filters, fontVariantNumeric, fontVariantNumericBase, hyphens, imageRenderings, isolations, lineClamps, listStyle, mixBlendModes, objectPositions, overscrolls, placeholders, screenReadersAccess, scrollBehaviors, scrollSnapTypeBase, scrolls, spaces, tables, textTransforms, touchActionBase, touchActions, viewTransition, writingModes, writingOrientations };
