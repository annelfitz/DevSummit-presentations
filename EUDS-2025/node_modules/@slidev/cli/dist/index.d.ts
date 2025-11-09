import * as vite from 'vite';
import { InlineConfig, PluginOption } from 'vite';
import { ResolvedSlidevOptions, SlidevServerOptions, SlidevEntryOptions, ResolvedSlidevUtils, SlidevPluginOptions } from '@slidev/types';
import * as fs from '@slidev/parser/fs';
export { fs as parser };

declare function createServer(options: ResolvedSlidevOptions, viteConfig?: InlineConfig, serverOptions?: SlidevServerOptions): Promise<vite.ViteDevServer>;

declare function resolveOptions(entryOptions: SlidevEntryOptions, mode: ResolvedSlidevOptions['mode']): Promise<ResolvedSlidevOptions>;
declare function createDataUtils(resolved: Omit<ResolvedSlidevOptions, 'utils'>): Promise<ResolvedSlidevUtils>;

declare function ViteSlidevPlugin(options: ResolvedSlidevOptions, pluginOptions?: SlidevPluginOptions, serverOptions?: SlidevServerOptions): Promise<PluginOption[]>;

export { ViteSlidevPlugin, createDataUtils, createServer, resolveOptions };
