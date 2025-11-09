import * as esbuild from 'esbuild';
import { Options } from './types.cjs';
import '@antfu/utils';
import 'unplugin';
import 'unplugin-utils';

declare const _default: (options: Options) => esbuild.Plugin;

export { _default as default };
