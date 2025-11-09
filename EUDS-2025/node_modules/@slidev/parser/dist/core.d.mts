import { SlidevConfig, SlidevThemeMeta, FontOptions, ResolvedFontOptions, SlidevMarkdown, SourceSlideInfo, SlidevDetectedFeatures, SlidevPreparserExtension } from '@slidev/types';
export { parseAspectRatio, parseRangeString } from './utils.mjs';

declare function getDefaultConfig(): SlidevConfig;
declare function resolveConfig(headmatter: any, themeMeta?: SlidevThemeMeta, filepath?: string, verify?: boolean): SlidevConfig;
declare function verifyConfig(config: SlidevConfig, themeMeta?: SlidevThemeMeta, warn?: (v: string) => void): void;
declare function resolveFonts(fonts?: FontOptions): ResolvedFontOptions;

interface SlidevParserOptions {
    noParseYAML?: boolean;
    preserveCR?: boolean;
}
declare function stringify(data: SlidevMarkdown): string;
declare function stringifySlide(data: SourceSlideInfo, idx?: number): string;
declare function prettifySlide(data: SourceSlideInfo): SourceSlideInfo;
declare function prettify(data: SlidevMarkdown): SlidevMarkdown;
declare function detectFeatures(code: string): SlidevDetectedFeatures;
declare function parseSlide(raw: string, options?: SlidevParserOptions): Omit<SourceSlideInfo, 'filepath' | 'index' | 'start' | 'contentStart' | 'end'>;
declare function parse(markdown: string, filepath: string, extensions?: SlidevPreparserExtension[], options?: SlidevParserOptions): Promise<SlidevMarkdown>;
declare function parseSync(markdown: string, filepath: string, options?: SlidevParserOptions): SlidevMarkdown;

export { type SlidevParserOptions, detectFeatures, getDefaultConfig, parse, parseSlide, parseSync, prettify, prettifySlide, resolveConfig, resolveFonts, stringify, stringifySlide, verifyConfig };
