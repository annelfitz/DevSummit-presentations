import { Plugin } from 'vite';
import { Options, PublicPluginAPI } from './types.js';
import '@antfu/utils';
import 'unplugin';
import 'unplugin-utils';

declare const _default: (options?: Options | undefined) => Plugin & {
    api: PublicPluginAPI;
};

export { _default as default };
