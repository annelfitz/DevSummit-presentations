import { PreparserExtensionLoader, SlidevData, SlidevMarkdown } from '@slidev/types';
export { SlidevParserOptions, detectFeatures, getDefaultConfig, parse, parseSlide, parseSync, prettify, prettifySlide, resolveConfig, resolveFonts, stringify, stringifySlide, verifyConfig } from './core.mjs';
export { parseAspectRatio, parseRangeString } from './utils.mjs';

declare function injectPreparserExtensionLoader(fn: PreparserExtensionLoader): void;
/**
 * Slidev data without config and themeMeta,
 * because config and themeMeta depends on the theme to be loaded.
 */
type LoadedSlidevData = Omit<SlidevData, 'config' | 'themeMeta'>;
declare function load(userRoot: string, filepath: string, loadedSource?: Record<string, string>, mode?: string): Promise<LoadedSlidevData>;
declare function save(markdown: SlidevMarkdown): Promise<string>;

export { type LoadedSlidevData, injectPreparserExtensionLoader, load, save };
