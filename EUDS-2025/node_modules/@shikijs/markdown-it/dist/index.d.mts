import MarkdownIt from 'markdown-it';
import { LanguageInput, BuiltinLanguage } from 'shiki';
import { M as MarkdownItShikiSetupOptions } from './shared/markdown-it.DGIVodq2.mjs';
export { a as MarkdownItShikiExtraOptions } from './shared/markdown-it.DGIVodq2.mjs';
export { fromHighlighter, setupMarkdownIt } from './core.mjs';

type MarkdownItShikiOptions = MarkdownItShikiSetupOptions & {
    /**
     * Language names to include.
     *
     * @default Object.keys(bundledLanguages)
     */
    langs?: Array<LanguageInput | BuiltinLanguage>;
    /**
     * Alias of languages
     * @example { 'my-lang': 'javascript' }
     */
    langAlias?: Record<string, string>;
};
declare function markdownItShiki(options: MarkdownItShikiOptions): Promise<(markdownit: MarkdownIt) => void>;

export { MarkdownItShikiSetupOptions, markdownItShiki as default };
export type { MarkdownItShikiOptions };
