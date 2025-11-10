import { Rule, CSSEntries, Shortcut, StaticRule, CSSValueInput, VariantHandler } from '@unocss/core';
import { T as Theme } from './shared/preset-wind4.CeNzqhCV.js';
export { r as rules } from './shared/preset-wind4.oLaz9HAb.js';
import { Theme as Theme$1 } from '@unocss/preset-wind4';

declare const verticalAligns: Rule<Theme>[];
declare const textAligns: Rule<Theme>[];

declare const animations: Rule<Theme>[];

declare const backgroundStyles: Rule<Theme>[];

declare const outline: Rule<Theme>[];
declare const appearance: Rule<Theme>[];
declare const willChange: Rule<Theme>[];
declare const listStyle: Rule<Theme>[];
declare const accents: Rule<Theme>[];
declare const carets: Rule<Theme>[];
declare const imageRenderings: Rule<Theme>[];
declare const overscrolls: Rule<Theme>[];
declare const scrollBehaviors: Rule<Theme>[];

declare const borderStyles: string[];
declare const borders: Rule<Theme>[];
declare function handlerBorderStyle([, a, s]: string[]): CSSEntries | undefined;

/**
 * @example op10 op-30 opacity-100
 */
declare const opacity: Rule<Theme>[];
declare const bgColors: Rule<Theme>[];
declare const colorScheme: Rule<Theme>[];

declare const columns: Rule<Theme>[];

declare const containerParent: Rule<Theme>[];
declare const container: Rule<Theme>[];
declare const containerShortcuts: Shortcut<Theme>[];

declare const textDecorations: Rule<Theme>[];

declare const divides: Rule<Theme>[];

declare const filters: Rule<Theme>[];

declare const flex: Rule<Theme>[];

declare const gaps: Rule<Theme>[];

declare const grids: Rule<Theme>[];

declare const overflows: Rule<Theme>[];

declare const lineClamps: Rule<Theme>[];

declare const masks: Rule<Theme$1>[];

declare const placeholders: Rule<Theme>[];

declare const positions: Rule<Theme>[];
declare const justifies: StaticRule[];
declare const orders: Rule<Theme>[];
declare const alignments: StaticRule[];
declare const placements: StaticRule[];
/**
 * This is to add `flex-` and `grid-` prefix to the alignment rules,
 * supporting `flex="~ items-center"` in attributify mode.
 */
declare const flexGridJustifiesAlignments: StaticRule[];
declare const insets: Rule<Theme>[];
declare const floats: Rule<Theme>[];
declare const zIndexes: Rule<Theme>[];
declare const boxSizing: Rule<Theme>[];

/**
 * Used for debugging, only available in development mode.
 *
 * @example `?` / `where`
 */
declare const questionMark: Rule<Theme>[];

declare const rings: Rule<Theme>[];

declare const scrolls: Rule<Theme>[];

declare const shadowProperties: {
    shadow: CSSValueInput;
    shadowColor: CSSValueInput;
    insetShadow: CSSValueInput;
    insetShadowColor: CSSValueInput;
    ringColor: CSSValueInput;
    ringShadow: CSSValueInput;
    insetRingColor: CSSValueInput;
    insetRingShadow: CSSValueInput;
    ringInset: CSSValueInput;
    ringOffsetWidth: CSSValueInput;
    ringOffsetColor: CSSValueInput;
    ringOffsetShadow: CSSValueInput;
};
declare const boxShadows: Rule<Theme>[];

declare const sizes: Rule<Theme>[];
declare const aspectRatio: Rule<Theme>[];

declare const paddings: Rule<Theme>[];
declare const margins: Rule<Theme>[];
declare const spaces: Rule<Theme>[];
declare function notLastChildSelectorVariant(s: string): VariantHandler;

declare const displays: Rule<Theme>[];
declare const appearances: Rule<Theme>[];
declare const cursors: Rule<Theme>[];
declare const contains: Rule<Theme>[];
declare const pointerEvents: Rule<Theme>[];
declare const resizes: Rule<Theme>[];
declare const userSelects: Rule<Theme>[];
declare const whitespaces: Rule<Theme>[];
declare const contentVisibility: Rule<Theme>[];
declare const contents: Rule<Theme>[];
declare const breaks: Rule<Theme>[];
declare const textWraps: Rule<Theme>[];
declare const textOverflows: Rule<Theme>[];
declare const textTransforms: Rule<Theme>[];
declare const fontStyles: Rule<Theme>[];
declare const fontSmoothings: Rule<Theme>[];
declare const hyphens: Rule<Theme>[];
declare const writingModes: Rule<Theme>[];
declare const writingOrientations: Rule<Theme>[];
declare const screenReadersAccess: Rule<Theme>[];
declare const isolations: Rule<Theme>[];
declare const objectPositions: Rule<Theme>[];
declare const backgroundBlendModes: Rule<Theme>[];
declare const mixBlendModes: Rule<Theme>[];
declare const dynamicViewportHeight: Rule<Theme>[];
declare const accessibility: Rule<Theme>[];
declare const fieldSizing: Rule<Theme>[];

declare const svgUtilities: Rule<Theme>[];

declare const tables: Rule<Theme>[];

declare const touchActions: Rule<Theme>[];

declare const transformBase: {
    '--un-rotate-x': string;
    '--un-rotate-y': string;
    '--un-rotate-z': string;
    '--un-skew-x': string;
    '--un-skew-y': string;
    '--un-translate-x': number;
    '--un-translate-y': number;
    '--un-translate-z': number;
};
declare const transforms: Rule<Theme>[];

declare const transitions: Rule<Theme>[];

declare const fonts: Rule<Theme>[];
declare const tabSizes: Rule<Theme>[];
declare const textIndents: Rule<Theme>[];
declare const textStrokes: Rule<Theme>[];
declare const textShadows: Rule<Theme>[];
declare const fontVariantNumeric: Rule<Theme>[];
declare function splitShorthand(body: string, type: string): string[] | undefined;

declare const cssVariables: Rule<Theme>[];
declare const cssProperty: Rule<Theme>[];

declare const viewTransition: Rule<Theme>[];

export { accents, accessibility, alignments, animations, appearance, appearances, aspectRatio, backgroundBlendModes, backgroundStyles, bgColors, borderStyles, borders, boxShadows, boxSizing, breaks, carets, colorScheme, columns, container, containerParent, containerShortcuts, contains, contentVisibility, contents, cssProperty, cssVariables, cursors, displays, divides, dynamicViewportHeight, fieldSizing, filters, flex, flexGridJustifiesAlignments, floats, fontSmoothings, fontStyles, fontVariantNumeric, fonts, gaps, grids, handlerBorderStyle, hyphens, imageRenderings, insets, isolations, justifies, lineClamps, listStyle, margins, masks, mixBlendModes, notLastChildSelectorVariant, objectPositions, opacity, orders, outline, overflows, overscrolls, paddings, placeholders, placements, pointerEvents, positions, questionMark, resizes, rings, screenReadersAccess, scrollBehaviors, scrolls, shadowProperties, sizes, spaces, splitShorthand, svgUtilities, tabSizes, tables, textAligns, textDecorations, textIndents, textOverflows, textShadows, textStrokes, textTransforms, textWraps, touchActions, transformBase, transforms, transitions, userSelects, verticalAligns, viewTransition, whitespaces, willChange, writingModes, writingOrientations, zIndexes };
