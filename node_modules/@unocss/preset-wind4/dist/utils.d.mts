import * as _unocss_rule_utils from '@unocss/rule-utils';
export * from '@unocss/rule-utils';
import { T as Theme } from './shared/preset-wind4.CeNzqhCV.mjs';
import { Arrayable, UtilObject, CSSEntry, DynamicMatcher, RuleContext, CSSObject, CSSValueInput, VariantContext, StaticRule } from '@unocss/core';

declare const PRESET_NAME = "@unocss/preset-wind4";
declare const CONTROL_NO_NEGATIVE = "$$mini-no-negative";
declare const SpecialColorKey: {
    transparent: string;
    current: string;
    inherit: string;
};

declare function numberWithUnit(str: string): string | undefined;
declare function auto(str: string): "auto" | undefined;
declare function rem(str: string): string | undefined;
declare function px(str: string): string | undefined;
declare function number(str: string): number | undefined;
declare function percent(str: string): string | undefined;
declare function fraction(str: string): string | undefined;
declare function bracket(str: string, theme?: Theme): string | undefined;
declare function bracketOfColor(str: string, theme?: Theme): string | undefined;
declare function bracketOfLength(str: string, theme?: Theme): string | undefined;
declare function bracketOfPosition(str: string, theme?: Theme): string | undefined;
declare function bracketOfFamily(str: string, theme?: Theme): string | undefined;
declare function bracketOfNumber(str: string, theme?: Theme): string | undefined;
declare function cssvar(str: string): string | undefined;
declare function time(str: string): string | undefined;
declare function degree(str: string): string | undefined;
declare function global(str: string): string | undefined;
declare function properties(str: string): string | undefined;
declare function position(str: string): string | undefined;
declare function none(str: string): "none" | undefined;

declare const handlers_auto: typeof auto;
declare const handlers_bracket: typeof bracket;
declare const handlers_bracketOfColor: typeof bracketOfColor;
declare const handlers_bracketOfFamily: typeof bracketOfFamily;
declare const handlers_bracketOfLength: typeof bracketOfLength;
declare const handlers_bracketOfNumber: typeof bracketOfNumber;
declare const handlers_bracketOfPosition: typeof bracketOfPosition;
declare const handlers_cssvar: typeof cssvar;
declare const handlers_degree: typeof degree;
declare const handlers_fraction: typeof fraction;
declare const handlers_global: typeof global;
declare const handlers_none: typeof none;
declare const handlers_number: typeof number;
declare const handlers_numberWithUnit: typeof numberWithUnit;
declare const handlers_percent: typeof percent;
declare const handlers_position: typeof position;
declare const handlers_properties: typeof properties;
declare const handlers_px: typeof px;
declare const handlers_rem: typeof rem;
declare const handlers_time: typeof time;
declare namespace handlers {
  export {
    handlers_auto as auto,
    handlers_bracket as bracket,
    handlers_bracketOfColor as bracketOfColor,
    handlers_bracketOfFamily as bracketOfFamily,
    handlers_bracketOfLength as bracketOfLength,
    handlers_bracketOfNumber as bracketOfNumber,
    handlers_bracketOfPosition as bracketOfPosition,
    handlers_cssvar as cssvar,
    handlers_degree as degree,
    handlers_fraction as fraction,
    handlers_global as global,
    handlers_none as none,
    handlers_number as number,
    handlers_numberWithUnit as numberWithUnit,
    handlers_percent as percent,
    handlers_position as position,
    handlers_properties as properties,
    handlers_px as px,
    handlers_rem as rem,
    handlers_time as time,
  };
}

declare const handler: _unocss_rule_utils.ValueHandler<string, Theme>;
declare const h: _unocss_rule_utils.ValueHandler<string, Theme>;

declare const directionMap: Record<string, string[]>;
declare const insetMap: Record<string, string[]>;
declare const cornerMap: Record<string, string[]>;
declare const xyzMap: Record<string, string[]>;
declare const xyzArray: string[];
declare const positionMap: Record<string, string>;
declare const globalKeywords: string[];
declare const cssMathFnRE: RegExp;
declare const cssVarFnRE: RegExp;

/**
 * Used to track theme keys.
 *
 * eg: colors:red-100
 *
 * @internal
 */
declare const trackedTheme: Set<string>;
declare function themeTracking(key: string, props?: Arrayable<string>): void;
declare function generateThemeVariable(key: string, props: Arrayable<string>): string;
declare function detectThemeValue(value: string, theme: Theme): void;
declare const trackedProperties: Map<string, string>;
declare function propertyTracking(property: string, value: string): void;

declare function createRemToPxProcessor(base?: number): (utilObjectOrEntry: UtilObject | CSSEntry) => void;

declare function numberResolver(size: string, defaultValue?: string | number): number | undefined;
/**
 * Returns a {@link DynamicMatcher} that generates spacing CSS properties for directional utilities.
 *
 * @param property - The base CSS property name (e.g. 'margin', 'padding').
 * @param map - Optional mapping of direction keys to property postfixes. Defaults to {@link directionMap}.
 * @param formatter - Optional function to format the final property name. Defaults to `(p, d) => \`\${p}\${d}\``.
 */
declare function directionSize(property: string, map?: Record<string, string[]>, formatter?: (p: string, d: string) => string): DynamicMatcher<Theme>;
/**
 * Split utility shorthand delimited by / or :
 */
declare function splitShorthand(body: string, type: string): string[] | undefined;
/**
 * Parse color string into {@link ParsedColorValue} (if possible). Color value will first be matched to theme object before parsing.
 * See also color.tests.ts for more examples.
 *
 * @example Parseable strings:
 * 'red' // From theme, if 'red' is available
 * 'red-100' // From theme, plus scale
 * 'red-100/20' // From theme, plus scale/opacity
 * '[rgb(100 2 3)]/[var(--op)]' // Bracket with rgb color and bracket with opacity
 * '[rgb(100 2 3)]/[var(--op)]/[in_oklab]' // Bracket with rgb color, bracket with opacity and bracket with interpolation method
 *
 * @param body - Color string to be parsed.
 * @param theme - {@link Theme} object.
 * @return object if string is parseable.
 */
declare function parseColor(body: string, theme: Theme): {
    opacity: string | undefined;
    modifier: string | undefined;
    name: string;
    no: string | undefined;
    color: string;
    alpha: string | undefined;
    /**
     * Keys means the color is from theme object.
     */
    keys: string[] | undefined;
    readonly cssColor: _unocss_rule_utils.CSSColorValue | undefined;
} | undefined;
declare function parseThemeColor(theme: Theme, keys: string[]): {
    color: string;
    no: string | undefined;
    keys: string[] | undefined;
} | undefined;
declare function getThemeByKey(theme: Theme, themeKey: keyof Theme, keys: string[]): any;
declare function colorCSSGenerator(data: ReturnType<typeof parseColor>, property: string, varName: string, ctx?: RuleContext<Theme>): [CSSObject, ...CSSValueInput[]] | undefined;
declare function colorResolver(property: string, varName: string): ([, body]: string[], ctx: RuleContext<Theme>) => (CSSValueInput | string)[] | undefined;
declare function colorableShadows(shadows: string | string[], colorVar: string, alpha?: string): string[];
declare function hasParseableColor(color: string | undefined, theme: Theme): boolean;
declare function resolveBreakpoints({ theme, generator }: Readonly<VariantContext<Theme>>, key?: 'breakpoint' | 'verticalBreakpoint'): {
    point: string;
    size: string;
}[] | undefined;
declare function resolveVerticalBreakpoints(context: Readonly<VariantContext<Theme>>): {
    point: string;
    size: string;
}[] | undefined;
declare function makeGlobalStaticRules(prefix: string, property?: string): StaticRule[];
declare function defineProperty(property: string, options?: {
    syntax?: string;
    inherits?: boolean;
    initialValue?: unknown;
}): CSSValueInput;
declare function isCSSMathFn(value: string | undefined): boolean;
declare function isSize(str: string): boolean;
declare function camelize(str: string): string;
declare function hyphenate(str: string): string;
declare function compressCSS(css: string, isDev?: boolean): string;

export { CONTROL_NO_NEGATIVE, PRESET_NAME, SpecialColorKey, camelize, colorCSSGenerator, colorResolver, colorableShadows, compressCSS, cornerMap, createRemToPxProcessor, cssMathFnRE, cssVarFnRE, defineProperty, detectThemeValue, directionMap, directionSize, generateThemeVariable, getThemeByKey, globalKeywords, h, handler, hasParseableColor, hyphenate, insetMap, isCSSMathFn, isSize, makeGlobalStaticRules, numberResolver, parseColor, parseThemeColor, positionMap, propertyTracking, resolveBreakpoints, resolveVerticalBreakpoints, splitShorthand, themeTracking, trackedProperties, trackedTheme, handlers as valueHandlers, xyzArray, xyzMap };
