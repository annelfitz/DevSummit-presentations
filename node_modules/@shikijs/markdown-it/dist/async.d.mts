import { MarkdownItAsync } from 'markdown-it-async';
import { CodeToHastOptions } from 'shiki';
import { M as MarkdownItShikiSetupOptions } from './shared/markdown-it.DGIVodq2.mjs';
export { a as MarkdownItShikiExtraOptions } from './shared/markdown-it.DGIVodq2.mjs';

declare function setupMarkdownWithCodeToHtml(markdownit: MarkdownItAsync, codeToHtml: (code: string, options: CodeToHastOptions<any, any>) => Promise<string>, options: MarkdownItShikiSetupOptions): void;
/**
 * Create a markdown-it-async plugin from a codeToHtml function.
 *
 * This plugin requires to be installed against a markdown-it-async instance.
 */
declare function fromAsyncCodeToHtml(codeToHtml: (code: string, options: CodeToHastOptions<any, any>) => Promise<string>, options: MarkdownItShikiSetupOptions): (markdownit: MarkdownItAsync) => Promise<void>;

export { MarkdownItShikiSetupOptions, fromAsyncCodeToHtml, setupMarkdownWithCodeToHtml };
